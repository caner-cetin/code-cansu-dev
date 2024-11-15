"use client";
import { useRef, useEffect, startTransition } from "react";
import { LANGUAGE_CONFIG } from "@/config/languages";
import { Settings, type CodeStorage } from "@/services/settings";
import type { AppContextType } from "@/contexts/AppContext";
import { config } from "ace-builds";

config.set(
	"basePath",
	"https://cdn.jsdelivr.net/npm/ace-builds@1.4.8/src-noconflict/",
);

export function useCodeEditor(ctx: AppContextType) {
	const previousLanguageRef = useRef<number>(ctx.languageId);
	const isFirstRender = useRef(true);

	useEffect(() => {
		if (!ctx.code?.current?.editor) return;
		const editor = ctx.code.current.editor;
		const currentLanguage = LANGUAGE_CONFIG[ctx.languageId];
		const prevLanguage = LANGUAGE_CONFIG[previousLanguageRef.current];

		if (isFirstRender.current) {
			isFirstRender.current = false;
			previousLanguageRef.current = ctx.languageId;
			return;
		}

		if (ctx.languageId !== previousLanguageRef.current) {
			// 1. Save current content before switching
			const currentContent = editor.getValue();
			const codes = JSON.parse(
				localStorage.getItem(Settings.CODE_STORAGE) || "{}",
			) as CodeStorage;

			if (currentContent.trim() && prevLanguage?.mode) {
				codes[prevLanguage.mode] = btoa(currentContent);
				localStorage.setItem(Settings.CODE_STORAGE, JSON.stringify(codes));
			}

			// 2. Update editor mode
			editor.session.setMode(`ace/mode/${currentLanguage?.mode}`);

			// 3. Load content for new language
			const savedCodes = JSON.parse(
				localStorage.getItem(Settings.CODE_STORAGE) || "{}",
			) as CodeStorage;

			const savedCode = currentLanguage?.mode
				? savedCodes[currentLanguage.mode]
				: "";
			const defaultText = currentLanguage?.defaultText || "";
			const newContent = savedCode ? atob(savedCode) : defaultText;

			// 4. Force a complete editor reset
			editor.setValue(""); // Clear first
			editor.session.setValue(newContent); // Then set new value
			editor.clearSelection();

			// 5. Update reference
			previousLanguageRef.current = ctx.languageId;

			// 6. Force refresh with a slight delay
			setTimeout(() => {
				editor.renderer.updateFull(true);
			}, 50);
		}
	}, [ctx.languageId]);

	// Handle source code changes from external sources
	useEffect(() => {
		if (ctx.code?.current?.editor && ctx.sourceCode) {
			ctx.code.current.editor.setValue(ctx.sourceCode, -1);
			ctx.code.current.editor.clearSelection();
		}
	}, [ctx.sourceCode]);

	// Handle theme changes
	useEffect(() => {
		if (ctx.code?.current?.editor) {
			ctx.code.current.editor.setTheme(`ace/theme/${ctx.colorTheme}`);
		}
	}, [ctx.colorTheme]);

	// Save before unload
	useEffect(() => {
		const handleBeforeUnload = () => {
			if (ctx.code?.current?.editor) {
				const currentContent = ctx.code.current.editor.getValue();
				const currentLanguage = LANGUAGE_CONFIG[ctx.languageId];

				if (currentContent.trim() && currentLanguage?.mode) {
					const codes = JSON.parse(
						localStorage.getItem(Settings.CODE_STORAGE) || "{}",
					) as CodeStorage;
					codes[currentLanguage.mode] = btoa(currentContent);
					localStorage.setItem(Settings.CODE_STORAGE, JSON.stringify(codes));
				}
			}
		};
		window.addEventListener("beforeunload", handleBeforeUnload);
		return () => window.removeEventListener("beforeunload", handleBeforeUnload);
	}, [ctx.languageId]);
}
