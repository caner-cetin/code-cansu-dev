import { HTTPException } from "hono/http-exception";
import type { Context } from "hono";
import type { Bindings } from ".";
import type { Dayjs } from "dayjs";
async function IsOK(response: Response, message: string) {
	if (!response.ok) {
		console.error(
			`>> ${response.url} ${response.status} ${JSON.stringify(await response.json())}`,
		);
		throw new HTTPException(500, { message: message });
	}
}

interface HealthResponse {
	queue: string;
	size: number;
	available: number;
	idle: number;
	working: number;
	paused: number;
	failed: number;
}

export interface LanguagesResponse {
	id: number;
	name: string;
}

interface CreateSubmissionResponse {
	token: string;
}

export interface GetSubmissionResponse {
	source_code: string;
	language_id: number;
	stdin: string;
	stdout: string | null | undefined;
	status_id: number;
	created_at: Dayjs;
	finished_at: Dayjs;
	time: number;
	memory: number;
	stderr: string | null | undefined;
	token: string;
	number_of_runs: number;
	cpu_time_limit: number;
	cpu_extra_time: number;
	wall_time_limit: number;
	memory_limit: number;
	stack_limit: number;
	max_file_size: number;
	compile_output: string | null | undefined;
	message: string | null | undefined;
	exit_code: number;
	wall_time: number;
}

export interface Judge {
	Submission: {
		create(
			code: string,
			language: number,
			stdin: string | null | undefined,
			b64encoded: boolean | null | undefined,
			wait: boolean | null | undefined,
			c: Context<{ Bindings: Bindings }>,
		): Promise<CreateSubmissionResponse>;
	};
}

export const Judge0: Judge = {
	Submission: {
		async create(
			code: string,
			language: number,
			stdin: string | null | undefined,
			b64encoded: boolean | null | undefined,
			wait: boolean | null | undefined,
			c: Context<{ Bindings: Bindings }>,
		) {
			const shouldWait = wait !== null && wait !== false && wait !== undefined;
			const isB64Enc =
				b64encoded !== null && b64encoded !== false && b64encoded !== undefined;
			let uri = `${c.env.JUDGE0_BASE_API_URL}/submissions/`;
			if (shouldWait && isB64Enc) {
				uri = `${uri}?base64_encoded=true&wait=true`;
			} else if (isB64Enc) {
				uri = `${uri}?base64_encoded=true`;
			} else if (shouldWait) {
				uri = `${uri}?wait=true`;
			}
			const body = JSON.stringify({
				source_code: code,
				language_id: language,
				stdin: stdin ?? null,
			});
			const response = await fetch(uri, {
				headers: {
					[c.env.JUDGE0_AUTHN_HEADER]: c.env.JUDGE0_AUTHN_TOKEN,
					"Content-Type": "application/json",
				},
				method: "POST",
				body: body,
			});
			await IsOK(response, "Could not submit the submission to the judges.");
			return (await response.json()) as CreateSubmissionResponse;
		},
	},
};
