"use server";

import api from "@/services/api";
import { States } from "@/services/settings";
import type {
	ReactCodeResponse,
	SubmitCodeResponse,
	LanguagesResponse,
	GetSubmissionResponse,
	HealthResponse,
} from "@/actions/judge/types";
import { type AppContextType, useAppContext } from "@/contexts/AppContext";

export type ReactSubmissionResponse = ReactCodeResponse;

export async function getHealth(): Promise<HealthResponse> {
	const res = await api.get<HealthResponse>("/judge/health");
	return res.data;
}

export async function getLanguages({
	languages,
	setLanguages,
}: AppContextType): Promise<LanguagesResponse | undefined> {
	if (languages === undefined || languages.length === 0) {
		setLanguages((await api.get<LanguagesResponse>("/judge/languages")).data);
	}
	return languages;
}

export async function submitCode(code: string): Promise<SubmitCodeResponse> {
	const res = await api.post<SubmitCodeResponse>("/judge/submit/code", code, {
		headers: { "Content-Type": "text/plain" },
	});
	return res.data;
}

export async function submitStdin(id: number, stdin: string): Promise<null> {
	await api.post(`/judge/submit/stdin?id=${id}`, stdin, {
		headers: { "Content-Type": "text/plain" },
	});
	return null;
}

export async function submitSubmission(
	id: number,
	languageId: number,
): Promise<GetSubmissionResponse> {
	const res = await api.put<GetSubmissionResponse>(
		`/judge/submit/${id}?language=${languageId}`,
	);
	return res.data;
}

export async function getSubmission(
	token: string,
): Promise<GetSubmissionResponse> {
	const res = await api.get<GetSubmissionResponse>(`/judge/${token}`);
	const data = res.data;
	data.stdin = atob(data.stdin);
	data.stdout = data.stdout ? atob(data.stdout) : null;
	data.stderr = data.stderr ? atob(data.stderr) : null;
	data.compile_output = data.compile_output ? atob(data.compile_output) : null;
	data.message = data.message ? atob(data.message) : null;
	return data;
}

export async function reactCode(
	code: string,
): Promise<ReactCodeResponse | undefined> {
	if (
		typeof window !== "undefined" &&
		localStorage.getItem(States.DISPLAYING_WAIFU_TIPS) !== null
	)
		return;
	const res = await api.post<ReactCodeResponse>("/react/code", code, {
		headers: { "Content-Type": "text/plain" },
	});
	return res.data;
}

export async function reactSubmission(
	token: string,
): Promise<ReactSubmissionResponse | undefined> {
	if (
		typeof window !== "undefined" &&
		localStorage.getItem(States.DISPLAYING_WAIFU_TIPS) !== null
	)
		return;
	const res = await api.post<ReactSubmissionResponse>(
		`/react/submission/${token}`,
	);
	return res.data;
}
