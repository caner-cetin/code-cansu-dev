import { useRef, useEffect, useCallback } from "react";
import { LANGUAGE_CONFIG } from "@/config/languages";
import { Settings, type CodeStorage } from "@/services/settings";
import { config } from "ace-builds";
import { useAppStore } from "@/stores/AppStore";
import type { IAceEditor } from "react-ace/lib/types";
import type ReactAce from "react-ace/lib/ace";

config.set(
	"basePath",
	"https://cdn.jsdelivr.net/npm/ace-builds@1.4.8/src-noconflict/",
);

export const useEditorContent = () => {
	const ctx = useAppStore.getState();
	const languageMode = ctx.code?.current.editor?.getMode().$id;

	const saveContent = useCallback(() => {
		if (!ctx.code?.current.editor || !languageMode) return;
		const currentContent = ctx.code.current.editor.getValue().trim();
		if (!currentContent) return;

		ctx.codeStorage[languageMode] = btoa(currentContent);
		ctx.setCodeStorage(ctx.codeStorage);
	}, [
		ctx.code?.current.editor,
		languageMode,
		ctx.codeStorage,
		ctx.setCodeStorage,
	]);

	const loadContent = useCallback(
		(defaultText = "") => {
			if (!ctx.code?.current.editor || !languageMode) return;

			const savedCode = ctx.codeStorage[languageMode];
			const newContent = savedCode ? atob(savedCode) : defaultText;

			ctx.code.current.editor.setValue(""); // Clear first
			ctx.code.current.editor.session.setValue(newContent);
			ctx.code.current.editor.clearSelection();
		},
		[ctx.code?.current.editor, languageMode, ctx.codeStorage[languageMode]],
	);

	const setMode = useCallback(
		(languageId: number) => {
			if (!ctx.code?.current.editor) return;
			ctx.code.current.editor.session.setMode(
				`ace/mode/${LANGUAGE_CONFIG[languageId]?.mode}`,
			);
		},
		[ctx.code?.current.editor],
	);

	return { saveContent, loadContent, setMode };
};

export function useCodeEditor() {
	const ctx = useAppStore.getState();
	const isFirstRender = useRef(true);

	const previousLanguageRef = useRef<number>(ctx.languageId);
	const editor = ctx.code?.current?.editor;

	// Save current editor content
	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	const saveEditorContent = useCallback(
		(languageMode: string) => {
			if (!editor || !languageMode) return;

			const currentContent = editor.getValue().trim();
			if (!currentContent) return;

			ctx.codeStorage[languageMode] = btoa(currentContent);
			ctx.setCodeStorage(ctx.codeStorage);
		},
		[editor, ctx.codeStorage],
	);

	// Load content for a specific language
	const loadEditorContent = useCallback(
		(languageMode: string, defaultText = "") => {
			if (!editor || !languageMode) return;

			const savedCode = ctx.codeStorage[languageMode];
			const newContent = savedCode ? atob(savedCode) : defaultText;
			console.log(newContent);
			editor.session.setValue(newContent);
			editor.clearSelection();
		},
		[editor, ctx.codeStorage],
	);

	// Handle language changes
	useEffect(() => {
		if (!editor || isFirstRender.current) {
			isFirstRender.current = false;
			previousLanguageRef.current = ctx.languageId;
			return;
		}

		const currentLanguage = LANGUAGE_CONFIG[ctx.languageId];
		const prevLanguage = LANGUAGE_CONFIG[previousLanguageRef.current];

		if (ctx.languageId !== previousLanguageRef.current) {
			// Save current content before switching
			if (prevLanguage?.mode) {
				saveEditorContent(prevLanguage.mode);
			}

			// Update editor mode
			if (currentLanguage?.mode) {
				editor.session.setMode(`ace/mode/${currentLanguage.mode}`);
				loadEditorContent(currentLanguage.mode, currentLanguage.defaultText);
			}

			previousLanguageRef.current = ctx.languageId;

			// Force refresh with a slight delay
			setTimeout(() => {
				editor.renderer.updateFull(true);
			}, 50);
		}
	}, [ctx.languageId, editor, saveEditorContent, loadEditorContent]);

	// Handle theme changes
	useEffect(() => {
		if (editor) {
			editor.setTheme(`ace/theme/${ctx.colorTheme}`);
		}
	}, [editor, ctx.colorTheme]);

	// Save before unload
	useEffect(() => {
		if (!editor) return;

		const handleBeforeUnload = () => {
			const currentLanguage = LANGUAGE_CONFIG[ctx.languageId];
			if (currentLanguage?.mode) {
				saveEditorContent(currentLanguage.mode);
			}
		};

		window.addEventListener("beforeunload", handleBeforeUnload);
		return () => window.removeEventListener("beforeunload", handleBeforeUnload);
	}, [editor, ctx.languageId, saveEditorContent]);
}
