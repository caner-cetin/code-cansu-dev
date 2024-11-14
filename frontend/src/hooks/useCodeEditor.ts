import { useRef, useState, useEffect, useCallback } from "react";
import { LANGUAGE_CONFIG } from "@/config/languages";
import { Settings, type CodeStorage, RenderFirst } from "@/services/settings";
import { type AppContextType, useAppContext } from "@/contexts/AppContext";
import { config, edit } from "ace-builds";

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

	// 	useEffect(() => {
	// 		if (live2DModelEnabled === true) {
	// 			Promise.all([
	// 				// @ts-ignore
	// 				import("@/scripts/waifu-tips.js"),
	// 				// @ts-ignore
	// 				import("@/scripts/live2d.min.js"),
	// 			]).then(() => {
	// 				// @ts-ignore
	// 				initWidget({
	// 					cdnPath: "https://fastly.jsdelivr.net/gh/fghrsh/live2d_api/",
	// 					tools: [],
	// 				});
	// 				// @ts-ignore
	// 			});
	// 			// ascii art from original author
	// 			// looks cute
	// 			console.log(`
	// く__,.ヘヽ.        /  ,ー､ 〉
	//          ＼ ', !-─‐-i  /  /´
	//          ／｀ｰ'       L/／｀ヽ､
	//        /   ／,   /|   ,   ,       ',
	//      ｲ   / /-‐/  ｉ  L_ ﾊ ヽ!   i
	//       ﾚ ﾍ 7ｲ｀ﾄ   ﾚ'ｧ-ﾄ､!ハ|   |
	//         !,/7 '0'     ´0iソ|    |
	//         |.从"    _     ,,,, / |./    |
	//         ﾚ'| i＞.､,,__  _,.イ /   .i   |
	//           ﾚ'| | / k_７_/ﾚ'ヽ,  ﾊ.  |
	//             | |/i 〈|/   i  ,.ﾍ |  i  |
	//            .|/ /  ｉ：    ﾍ!    ＼  |
	//             kヽ>､ﾊ    _,.ﾍ､    /､!
	//             !'〈//｀Ｔ´', ＼ ｀'7'ｰr'
	//             ﾚ'ヽL__|___i,___,ンﾚ|ノ
	//                 ﾄ-,/  |___./
	//                 'ｰ'    !_,.:
	//       `);
	// 		}
	// 	}, [live2DModelEnabled]);
}
