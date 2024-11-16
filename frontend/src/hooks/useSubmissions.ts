import { toast } from "react-hot-toast";
import type ReactAce from "react-ace/lib/ace";
import { LANGUAGE_CONFIG } from "@/config/languages";
import { LanguageId, Settings } from "@/services/settings";
import { submitStdin, submitSubmission } from "@/services/judge/calls";
import { AppState, useAppStore } from "@/stores/AppStore";

export interface StoredSubmission {
	localId: number;
	globalId: number;
	token: string;
	iconClass: string;
}

export namespace Submissions {
	export function getNextSubmissionId(): number {
		useAppStore.setState((state) => {
			state.setSubmissionCounter(state.submissionCounter + 1);
			return state;
		});
		return useAppStore.getState().submissionCounter;
	}

	export function saveSubmission(submission: StoredSubmission) {
		const ctx = useAppStore.getState();
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
	export function clearStoredSubmissions(): void {
		useAppStore.setState((state) => {
			state.setSubmissions([]);
			state.setSubmissionCounter(0);
			return state;
		});
	}
	export async function handleSubmitCode(withStdin: boolean): Promise<void> {
		const ctx = useAppStore.getState();
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
			if (!withStdin) {
				await finalizeSubmission();
			}
		} catch (error) {
			console.error(error);
			toast.error("Processing submission failed");
		}
	}

	export async function handleSubmitStdin(stdin: string): Promise<void> {
		const ctx = useAppStore.getState();
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
			await finalizeSubmission();
		} catch (error) {
			toast.error("Processing submission failed");
			console.error(error);
		}
	}

	async function finalizeSubmission(): Promise<void> {
		const ctx = useAppStore.getState();
		const id = ctx.ongoingCodeSubmissionId;
		const result = await submitSubmission(id, ctx.languageId);
		const localId = getNextSubmissionId();
		const newSubmission = {
			localId,
			globalId: id,
			token: result.token,
			iconClass: LANGUAGE_CONFIG[ctx.languageId]?.iconClass || "",
		};
		saveSubmission(newSubmission);
		toast.loading("Submission in progress...", {
			duration: 3000,
		});
	}
}

export default Submissions;
