import { toast } from "react-hot-toast";
import type ReactAce from "react-ace/lib/ace";
import { LANGUAGE_CONFIG } from "@/config/languages";
import { LanguageId, Settings } from "@/services/settings";
import {
	submitCode,
	submitStdin,
	submitSubmission,
} from "@/services/judge/calls";
import { useAppStore } from "@/stores/AppStore";
import { useEditorRef } from "@/stores/EditorStore";
import type { IAceEditor } from "react-ace/lib/types";

export interface StoredSubmission {
	localId: number;
	globalId: number;
	token: string;
	iconClass: string;
}

export namespace Submissions {
	export function getNextSubmissionId(): number {
		const state = useAppStore.getState();
		state.setSubmissionCounter(state.submissionCounter + 1);
		return state.submissionCounter;
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
		}
	}
	export function clearStoredSubmissions(): void {
		const state = useAppStore.getState();
		state.setSubmissions([]);
		state.setSubmissionCounter(0);
	}
	export async function handleSubmitCode(
		stdin: string | undefined,
		editor: IAceEditor | undefined,
	): Promise<void> {
		const ctx = useAppStore.getState();
		if (!editor) {
			toast.error("Editor not initialized, please refresh page");
			return;
		}
		if (ctx.languageId === LanguageId.Markdown) {
			toast.error("what did you expect?");
			return;
		}
		const src = editor.session.getValue();
		if (src === undefined || src.trim() === "") {
			toast.error("Code cannot be empty");
			return;
		}
		const subId = (await submitCode(src)).id;
		try {
			if (stdin !== undefined) {
				await submitStdin(subId, stdin);
			}
			await finalizeSubmission(subId);
		} catch (error) {
			console.error(error);
			toast.error("Processing submission failed");
		}
	}

	async function finalizeSubmission(id: number): Promise<void> {
		const ctx = useAppStore.getState();
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
