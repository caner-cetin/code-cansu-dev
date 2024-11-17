import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { LanguagesResponse } from "@/services/judge/types";
import type { StoredSubmission } from "@/hooks/useSubmissions";
import {
	LanguageId,
	Themes,
	type CodeStorage,
} from "@/services/settings";

export interface AppState {

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
	colorTheme: string;
	setColorTheme: (theme: string) => void;

	// Code and submissions
	submissions: StoredSubmission[];
	setSubmissions: (submissions: StoredSubmission[]) => void;
	codeStorage: CodeStorage;
	setCodeStorage: (storage: CodeStorage) => void;
	submissionCounter: number;
	setSubmissionCounter: (key: number) => void;
}

export const useAppStore = create<AppState>()(
	persist(
		(set) => ({

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

			colorTheme: Themes.TomorrowNightEighties,
			setColorTheme: (theme) => set({ colorTheme: theme }),

			// Code and submissions
			submissions: [],
			setSubmissions: (submissions) => set({ submissions }),
			codeStorage: {},
			setCodeStorage: (storage) => set({ codeStorage: storage }),
			submissionCounter: 1,
			setSubmissionCounter: (key) => set({ submissionCounter: key }),
		}),
		{
			name: "app-storage",
			partialize: (state) => ({
				languageId: state.languageId,
				languages: state.languages,
				live2DModelEnabled: state.live2DModelEnabled,
				colorTheme: state.colorTheme,
				submissions: state.submissions,
				codeStorage: state.codeStorage,
				submissionCounterKey: state.submissionCounter,
			}),
		},
	),
);
