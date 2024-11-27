import api from "@/services/api";
import { States } from "@/services/settings";
import type {
	ReactCodeResponse,
	LanguagesResponse,
	GetSubmissionResponse,
	ExecuteCodeRequest,
	ExecuteCodeResponse,
} from "@/services/playground/types";
import { useAppStore } from "@/stores/AppStore";

export type ReactSubmissionResponse = ReactCodeResponse;


export async function getLanguages(): Promise<void> {
	const ctx = useAppStore.getState();
	if (ctx.languages === undefined || ctx.languages.length === 0) {
		ctx.setLanguages(
			(await api.get<LanguagesResponse>("/judge/languages")).data,
		);
	}
}

export async function submitSubmission(request: ExecuteCodeRequest): Promise<ExecuteCodeResponse> {
	const res = await api.post<ExecuteCodeResponse>(
		`/judge/execute`,
		request,
	);
	return res.data;
}

export async function getSubmission(
	token: string,
): Promise<GetSubmissionResponse> {
	const res = await api.get<GetSubmissionResponse>(`/judge/${token}`);
	const data = res.data;
	data.Stdin = atob(data.Stdin);
	data.Stdout = atob(data.Stdout);
	return data;
}

export async function reactSubmission(
	token: string,
): Promise<string | undefined> {
	const ctx = useAppStore.getState();
	if (
		(typeof window !== "undefined" &&
		localStorage.getItem(States.DISPLAYING_WAIFU_TIPS) === "1") ||
		ctx.displayingSharedCode === true
	)
		return;
	const res = await api.get<string>(
		`/judge/${token}/react`,
	);
	return res.data;
}
