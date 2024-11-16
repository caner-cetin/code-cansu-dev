export type HealthResponse = Array<{
	queue: string;
	size: number;
	available: number;
	idle: number;
	working: number;
	paused: number;
	failed: number;
}>;

export type LanguagesResponse = Array<{
	id: number;
	name: string;
}>;

export type SubmitCodeResponse = {
	id: number;
};

export type GetSubmissionResponse = {
	source_code: string;
	language_id: number;
	stdin: string;
	stdout: string | null | undefined;
	status_id: number;
	created_at: string;
	finished_at: string;
	time: string;
	memory: number;
	stderr: string | null | undefined;
	token: string;
	number_of_runs: number;
	cpu_time_limit: string;
	cpu_extra_time: string;
	wall_time_limit: string;
	memory_limit: number;
	stack_limit: number;
	max_file_size: number;
	compile_output: string | null | undefined;
	message: string | null | undefined;
	exit_code: number;
	wall_time: string;
};

export type ReactCodeResponse = {
	message: string;
};
