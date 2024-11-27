import { useRef, useEffect, useCallback, useMemo } from "react";
import { LANGUAGE_CONFIG } from "@/config/languages";
import type { CodeStorage } from "@/services/settings";
import { config } from "ace-builds";
import { useAppStore } from "@/stores/AppStore";
import type ReactAce from "react-ace/lib/ace";
import { useRTCStore } from "@/stores/RTCStore";
import {  MessageTypes } from "@/services/rtc";

config.set(
	"basePath",
	"https://cdn.jsdelivr.net/npm/ace-builds@1.4.8/src-noconflict/",
);

export const useEditorContent = (
	editorRef: React.MutableRefObject<ReactAce | null>,
	codeStorage: CodeStorage,
	setCodeStorage: (storage: CodeStorage) => void,
) => {
	const { rtcEnabled, rtcClient } = useRTCStore();
	// Get the current language mode using useMemo to prevent unnecessary recalculations
	const languageMode = useMemo(() => {
		if (!editorRef.current?.editor) return null;
		// @ts-ignore (id exists but type is not available)
		return editorRef.current.editor.session.getMode()?.$id;
	}, [editorRef.current?.editor]);

	const saveContent = useCallback(() => {
		if (!editorRef.current?.editor || !languageMode) return;
		const currentContent = editorRef.current.editor.getValue().trim();
		if (!currentContent) return;

		const newStorage = { ...codeStorage };
		newStorage[languageMode] = btoa(currentContent);
		setCodeStorage(newStorage);
	}, [editorRef, languageMode, setCodeStorage, codeStorage]);

	const loadContent = useCallback(
		(defaultText = "") => {
			if (!editorRef.current?.editor || !languageMode) return;

			const savedCode = codeStorage[languageMode];
			const newContent = savedCode ? atob(savedCode) : defaultText;

			editorRef.current.editor.setValue(""); // Clear first
			editorRef.current.editor.session.setValue(newContent);
			editorRef.current.editor.clearSelection();
			if (rtcEnabled) {
				rtcClient?.ws?.send(
					JSON.stringify({
						type: MessageTypes.EDITOR_CONTENT,
						payload: btoa(newContent),
					}),
				);
			}
		},
		[editorRef, languageMode, codeStorage],
	);

	const setMode = useCallback(
		(languageId: number) => {
			if (!editorRef.current?.editor) return;
			const mode = LANGUAGE_CONFIG[languageId]?.mode;
			if (mode) {
				editorRef.current.editor.session.setMode(`ace/mode/${mode}`);
			}
		},
		[editorRef],
	);

	return { saveContent, loadContent, setMode };
};

export function useCodeEditor(
	editorRef: React.MutableRefObject<ReactAce | null>,
) {
	const { languageId, colorTheme, codeStorage, setCodeStorage } = useAppStore();
	const {rtcEnabled, rtcClient} = useRTCStore();
	const isFirstRender = useRef(true);
	const previousLanguageRef = useRef<number>(languageId);

	// Memoize editor instance
	const editor = useMemo(() => editorRef.current?.editor, [editorRef.current]);

	// Save editor content with proper dependency tracking
	const saveEditorContent = useCallback(
		(mode: string) => {
			if (!editor || !mode) return;
			const currentContent = editor.getValue().trim();
			if (!currentContent) return;

			const newStorage = { ...codeStorage };
			newStorage[mode] = btoa(currentContent);
			setCodeStorage(newStorage);
		},
		[editor, codeStorage, setCodeStorage],
	);

	// Load editor content with proper dependency tracking
	const loadEditorContent = useCallback(
		(mode: string, defaultText = "") => {
			if (!editor || !mode) return;

			const savedCode = codeStorage[mode];
			const newContent = savedCode ? atob(savedCode) : defaultText;
			editor.session.setValue(newContent);
			editor.clearSelection();

			if (rtcEnabled) {
				rtcClient?.ws?.send(JSON.stringify({
					type: MessageTypes.EDITOR_CONTENT,
					payload: btoa(newContent),
				}))
			}
		},
		[editor, codeStorage],
	);

	// Handle language changes
	useEffect(() => {
		if (!editor || isFirstRender.current) {
			isFirstRender.current = false;
			previousLanguageRef.current = languageId;
			return;
		}

		const currentLanguage = LANGUAGE_CONFIG[languageId];
		const prevLanguage = LANGUAGE_CONFIG[previousLanguageRef.current];

		if (languageId !== previousLanguageRef.current) {
			// Save current content before switching
			if (prevLanguage?.mode) {
				saveEditorContent(prevLanguage.mode);
			}

			// Update editor mode and load content
			if (currentLanguage?.mode) {
				editor.session.setMode(`ace/mode/${currentLanguage.mode}`);
				loadEditorContent(currentLanguage.mode, currentLanguage.defaultText);
			}

			previousLanguageRef.current = languageId;

			if (rtcEnabled) {
				rtcClient?.ws?.send(JSON.stringify({
						type: MessageTypes.CURRENT_LANGUAGE_ID,
						payload: {
								id: languageId,
								issuedBy: rtcClient.metadata.id,
						}
				}));
		}

		}
	}, [languageId, editor, saveEditorContent, loadEditorContent]);

	// Handle theme changes
	useEffect(() => {
		if (editor) {
			editor.setTheme(`ace/theme/${colorTheme}`);
		}
	}, [editor, colorTheme]);

	// Save before unload
	useEffect(() => {
		if (!editor) return;

		const handleBeforeUnload = () => {
			const currentLanguage = LANGUAGE_CONFIG[languageId];
			if (currentLanguage?.mode) {
				saveEditorContent(currentLanguage.mode);
			}
		};

		window.onbeforeunload = handleBeforeUnload;
	}, [editor, languageId, saveEditorContent]);
}
