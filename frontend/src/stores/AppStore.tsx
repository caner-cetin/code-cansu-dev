import { create } from "zustand";
import { persist } from "zustand/middleware";
import type AceEditor from "react-ace";
import type { LanguagesResponse } from "@/services/judge/types";
import type { StoredSubmission } from "@/hooks/useSubmissions";
import {
	Settings,
	LanguageId,
	RenderFirst,
	Themes,
	type CodeStorage,
} from "@/services/settings";

export interface AppState {
	// Editor
	code: React.MutableRefObject<AceEditor> | undefined;
	setCode: (ref: React.MutableRefObject<AceEditor>) => void;

	// Language
	languageId: number;
	setLanguageId: (id: number) => void;
	languages: LanguagesResponse;
	setLanguages: (languages: LanguagesResponse) => void;

	// Display states
	displayingSharedCode: boolean;
	setDisplayingSharedCode: (displaying: boolean) => void;
	live2DModelEnabled: boolean;
	setLive2DModelEnabled: (enabled: boolean) => void;

	// Rendering and theme
	renderFirst: number;
	setRenderFirst: (renderFirst: number) => void;
	colorTheme: string;
	setColorTheme: (theme: string) => void;

	// Code and submissions
	submissions: StoredSubmission[];
	setSubmissions: (submissions: StoredSubmission[]) => void;
	ongoingCodeSubmissionId: number;
	setOngoingCodeSubmissionId: (id: number) => void;
	codeStorage: CodeStorage;
	setCodeStorage: (storage: CodeStorage) => void;
	submissionCounter: number;
	setSubmissionCounter: (key: number) => void;
}

export const useAppStore = create<AppState>()(
	persist(
		(set) => ({
			// Editor
			code: undefined,
			setCode: (ref) => set({ code: ref }),

			// Language
			languageId: LanguageId.Markdown,
			setLanguageId: (id) => set({ languageId: id }),
			languages: [],
			setLanguages: (languages) => set({ languages }),

			// Display states
			displayingSharedCode: false,
			setDisplayingSharedCode: (displaying) =>
				set({ displayingSharedCode: displaying }),
			live2DModelEnabled: true,
			setLive2DModelEnabled: (enabled) => set({ live2DModelEnabled: enabled }),

			// Rendering and theme
			renderFirst: RenderFirst.WelcomeMarkdown,
			setRenderFirst: (renderFirst) => set({ renderFirst }),
			colorTheme: Themes.TomorrowNightEighties,
			setColorTheme: (theme) => set({ colorTheme: theme }),

			// Code and submissions
			submissions: [],
			setSubmissions: (submissions) => set({ submissions }),
			ongoingCodeSubmissionId: -1,
			setOngoingCodeSubmissionId: (id) => set({ ongoingCodeSubmissionId: id }),
			codeStorage: {},
			setCodeStorage: (storage) => set({ codeStorage: storage }),
			submissionCounter: 0,
			setSubmissionCounter: (key) => set({ submissionCounter: key }),
		}),
		{
			name: "app-storage",
			partialize: (state) => ({
				languageId: state.languageId,
				languages: state.languages,
				live2DModelEnabled: state.live2DModelEnabled,
				renderFirst: state.renderFirst,
				colorTheme: state.colorTheme,
				submissions: state.submissions,
				ongoingCodeSubmissionId: state.ongoingCodeSubmissionId,
				codeStorage: state.codeStorage,
				submissionCounterKey: state.submissionCounter,
			}),
		},
	),
);
