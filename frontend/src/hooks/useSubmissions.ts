import { toast } from "react-hot-toast";
import type ReactAce from "react-ace/lib/ace";
import { LANGUAGE_CONFIG } from "@/config/languages";
import { LanguageId, Settings } from "@/services/settings";
import type { AppContextType } from "@/contexts/AppContext";
import {
	submitCode,
	submitStdin,
	submitSubmission,
} from "@/actions/judge/calls";
import { useLocalStorage } from "./useLocalStorage";

export interface StoredSubmission {
	localId: number;
	globalId: number;
	token: string;
	iconClass: string;
}

export namespace Submissions {
	export function getNextSubmissionId(): number {
		const currentCounter = localStorage.getItem(
			Settings.SUBMISSION_COUNTER_KEY,
		);
		const nextId = currentCounter ? Number.parseInt(currentCounter, 10) + 1 : 1;
		localStorage.setItem(Settings.SUBMISSION_COUNTER_KEY, nextId.toString());
		return nextId;
	}

	export function saveSubmission(submission: StoredSubmission): void {
		const submissions = getStoredSubmissions();
		submissions.push(submission);
		localStorage.setItem(Settings.SUBMISSIONS_KEY, JSON.stringify(submissions));
	}

	export function getStoredSubmissions(): StoredSubmission[] {
		const storedSubmissions = localStorage.getItem(Settings.SUBMISSIONS_KEY);
		return storedSubmissions ? JSON.parse(storedSubmissions) : [];
	}

	export function clearStoredSubmissions(): void {
		localStorage.removeItem(Settings.SUBMISSIONS_KEY);
		localStorage.removeItem(Settings.SUBMISSION_COUNTER_KEY);
	}

	export async function handleSubmitCode(
		withStdin: boolean,
		ctx: AppContextType,
	): Promise<void> {
		if (ctx.languageId === LanguageId.Markdown) {
			toast.error("what did you expect?");
			return;
		}
		const src = ctx.code?.current.editor.getValue();
		if (src === undefined || src.trim() === "") {
			toast.error("Code cannot be empty");
			return;
		}
		try {
			const result = await submitCode(src);
			ctx.setOngoingCodeSubmissionId(result.id);
			if (!withStdin) {
				await finalizeSubmission(ctx);
			}
		} catch (error) {
			console.error(error);
			toast.error("Processing submission failed");
		}
	}

	export async function handleSubmitStdin(
		stdin: string,
		ctx: AppContextType,
	): Promise<void> {
		if (ctx.languageId === LanguageId.Markdown) {
			toast.error("what did you expect?");
			return;
		}
		if (ctx.ongoingCodeSubmissionId === -1) {
			toast.error("No submission available, submit code first");
			return;
		}
		try {
			if (stdin.trim() !== "") {
				await submitStdin(ctx.ongoingCodeSubmissionId, stdin);
			}
			await finalizeSubmission(ctx);
		} catch (error) {
			toast.error("Processing submission failed");
			console.error(error);
		}
	}

	async function finalizeSubmission(ctx: AppContextType): Promise<void> {
		if (ctx.ongoingCodeSubmissionId === -1) {
			toast.error("No submission available, submit code first");
			return;
		}
		const result = await submitSubmission(
			ctx.ongoingCodeSubmissionId,
			ctx.languageId,
		);
		const localId = getNextSubmissionId();
		const newSubmission = {
			localId,
			globalId: ctx.ongoingCodeSubmissionId,
			token: result.token,
			iconClass: LANGUAGE_CONFIG[ctx.languageId]?.iconClass || "",
		};
		saveSubmission(newSubmission);
		ctx.setSubmissions((prev) =>
			[newSubmission, ...prev].sort((a, b) => b.localId - a.localId),
		);
		toast.loading("Submission in progress...", {
			duration: 3000,
		});
	}

	export function handleClearSubmissions(
		setSubmissions: React.Dispatch<React.SetStateAction<StoredSubmission[]>>,
	): void {
		clearStoredSubmissions();
		setSubmissions([]);
		toast.success("Submissions cleared");
	}
}

export default Submissions;
