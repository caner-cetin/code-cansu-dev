import { toast } from "react-hot-toast";
import { LANGUAGE_CONFIG } from "@/config/languages";
import { LanguageId } from "@/services/settings";
import {
	submitSubmission,
} from "@/services/playground/calls";
import { useAppStore } from "@/stores/AppStore";
import { useRTCStore } from "@/stores/RTCStore";
import { MessageTypes } from "@/services/rtc";

export interface StoredSubmission {
	localId: number;
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
	// do not encode b64 string while sending here im decoding already
	export async function executeCode(code: string | undefined, stdin: string | undefined): Promise<void> {
		if (!code) {
			toast.error("No code to execute");
			return
		}
		if (!stdin) {
			stdin = '';
		}
		const ctx = useAppStore.getState();
		const result = await submitSubmission({
			code: btoa(code),
			stdin: btoa(stdin),
			language: ctx.languageId as LanguageId,
			commandLineArguments: undefined,
			compilerOptions: undefined,
		});
		const localId = getNextSubmissionId();
		const newSubmission = {
			localId,
			token: result.id,
			iconClass: LANGUAGE_CONFIG[ctx.languageId]?.iconClass || "",
		};
		saveSubmission(newSubmission);
		toast.loading("Submission in progress...", {
			duration: 3000,
		});
	}
}

export default Submissions;
