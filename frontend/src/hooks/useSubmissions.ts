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

	export function saveSubmission(
		submission: StoredSubmission,
		ctx: AppContextType,
	): void {
		if (!ctx.submissions) {
			ctx.setSubmissions([]);
		}
		// eslint please shut up
		if (ctx.submissions) {
			ctx.setSubmissions(
				[submission, ...ctx.submissions].sort((a, b) => b.localId - a.localId),
			);
			ctx.setOngoingCodeSubmissionId(-1);
		}
	}

	export function clearStoredSubmissions(ctx: AppContextType): void {
		ctx.setSubmissions([]);
		localStorage.setItem(Settings.SUBMISSION_COUNTER_KEY, "0");
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
			const subid = ctx.setOngoingCodeSubmissionId(result.id);
			if (!withStdin) {
				// if i set the id and call finalize submission afterwards, ongoing id is -1, but when i call the handle submit code again, its correct value.
				// looking at local storage, i am correctly setting the sub id just in time in context
				// so there is a small delay of god knows what to update the context, we need to pass the id seperately to finalize submission
				// i hate this language so fucking much
				await finalizeSubmission(ctx, subid);
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
			// read the handlesubmitcode comment
			await finalizeSubmission(ctx, ctx.ongoingCodeSubmissionId);
		} catch (error) {
			toast.error("Processing submission failed");
			console.error(error);
		}
	}

	async function finalizeSubmission(
		ctx: AppContextType,
		id: number,
	): Promise<void> {
		const result = await submitSubmission(id, ctx.languageId);
		const localId = getNextSubmissionId();
		const newSubmission = {
			localId,
			globalId: id,
			token: result.token,
			iconClass: LANGUAGE_CONFIG[ctx.languageId]?.iconClass || "",
		};
		saveSubmission(newSubmission, ctx);
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
