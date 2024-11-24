import { toast } from "react-hot-toast";
import { LANGUAGE_CONFIG } from "@/config/languages";
import { LanguageId } from "@/services/settings";
import {
	submitCode,
	submitStdin,
	submitSubmission,
} from "@/services/judge/calls";
import { useAppStore } from "@/stores/AppStore";
import type { IAceEditor } from "react-ace/lib/types";
import { useRTCStore } from "@/stores/RTCStore";
import { MessageTypes } from "@/services/rtc/client";

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
		const rtcCtx = useRTCStore.getState();
		if (!ctx.submissions) {
			ctx.setSubmissions([]);
		}
		// eslint please shut up
		if (ctx.submissions) {
			ctx.setSubmissions(
				[submission, ...ctx.submissions].sort((a, b) => b.localId - a.localId),
			);
		}

		if (rtcCtx.host) {
			rtcCtx.rtcClient?.ws?.send(
				JSON.stringify({
					type: MessageTypes.NEW_SUBMISSION,
					payload: submission,
				}),
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
		if (ctx.languageId === LanguageId.Markdown) {
			toast.error("what did you expect?");
			return;
		}
		if (!editor) {
			toast.error("Editor not initialized, please refresh page");
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
