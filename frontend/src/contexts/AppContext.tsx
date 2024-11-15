"use client";

import {
	createContext,
	useContext,
	useState,
	useRef,
	type MutableRefObject,
	useEffect,
} from "react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import {
	Settings,
	LanguageId,
	RenderFirst,
	Themes,
} from "@/services/settings";
import type { StoredSubmission } from "@/hooks/useSubmissions";
import type { LanguagesResponse } from "@/actions/judge/types";
import type AceEditor from "react-ace";

export interface AppContextType {
	code: MutableRefObject<AceEditor> | undefined;
	languageId: LanguageId;
	setLanguageId: (id: number) => void;
	languages: LanguagesResponse | undefined;
	setLanguages: (languages: LanguagesResponse) => LanguagesResponse;
	displayingSharedCode: boolean;
	setDisplayingSharedCode: (displaying: boolean) => void;
	live2DModelEnabled: boolean;
	setLive2DModelEnabled: (enabled: boolean) => boolean;
	renderFirst: number;
	setRenderFirst: (renderFirst: number) => number;
	colorTheme: string;
	setColorTheme: (theme: string) => string;
	submissions: StoredSubmission[] | undefined;
	setSubmissions: (value: StoredSubmission[]) => StoredSubmission[];
	sourceCode?: string;
	setSourceCode?: (sourceCode: string) => string;
	ongoingCodeSubmissionId: number;
	setOngoingCodeSubmissionId: (id: number) => number;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	const code = useRef<AceEditor>();
	const [languageId, setLanguageId] = useLocalStorage<number>(Settings.DEFAULT_LANGUAGE_ID, LanguageId.Python3);
	const [submissions, setSubmissions] = useLocalStorage<StoredSubmission[]>(
		Settings.SUBMISSIONS_KEY,
		[],
	);
	const [languages, setLanguages] = useLocalStorage<LanguagesResponse>(Settings.LANGUAGES, []);
	const [displayingSharedCode, setDisplayingSharedCode] = useState(false);
	const [live2DModelEnabled, setLive2DModelEnabled] = useLocalStorage<boolean>(Settings.LIVE_2D_MODEL_ENABLED, true);
	const [renderFirst, setRenderFirst] = useLocalStorage<number>(Settings.RENDER_FIRST, RenderFirst.WelcomeMarkdown);
	const [colorTheme, setColorTheme] = useLocalStorage<string>(Settings.COLOR_THEME, Themes.TomorrowNightEighties);
	const [sourceCode, setSourceCode] = useState<string>();
	const [ongoingCodeSubmissionId, setOngoingCodeSubmissionId] = useLocalStorage<number>(Settings.ONGOING_CODE_SUBMISSION_ID, -1);


	return (
		<AppContext.Provider
			value={{
				// @ts-ignore
				code,
				languageId,
				setLanguageId,
				languages,
				setLanguages,
				displayingSharedCode,
				setDisplayingSharedCode,
				live2DModelEnabled,
				setLive2DModelEnabled,
				renderFirst,
				setRenderFirst,
				colorTheme,
				setColorTheme,
				submissions,
				setSubmissions,
				sourceCode,
				setSourceCode,
				ongoingCodeSubmissionId,
				setOngoingCodeSubmissionId
			}}
		>
			{children}
		</AppContext.Provider >
	);
};

export const useAppContext = () => {
	const context = useContext(AppContext);
	if (context === undefined) {
		throw new Error("useAppContext must be used within an AppProvider");
	}
	return context;
};
