import { Kysely, PostgresDialect } from "kysely";
import type { ColumnType } from "kysely";
import { Pool } from "pg";
import type { Dayjs } from "dayjs";

export type Generated<T> = T extends ColumnType<infer S, infer I, infer U>
	? ColumnType<S, I | undefined, U>
	: ColumnType<T, T | undefined, T>;

export type Numeric = ColumnType<number, number, number>;

export type Timestamp = ColumnType<Dayjs, Dayjs | string, Dayjs | string>;

export interface ArInternalMetadata {
	created_at: Timestamp;
	key: string;
	updated_at: Timestamp;
	value: string | null;
}

export interface Clients {
	id: string;
}

export interface Languages {
	compile_cmd: string | null;
	id: Generated<number>;
	is_archived: Generated<boolean | null>;
	name: string | null;
	run_cmd: string | null;
	source_file: string | null;
}

export interface SchemaMigrations {
	version: string;
}

export interface Submissions {
	additional_files: Buffer | null;
	callback_url: string | null;
	command_line_arguments: string | null;
	compile_output: string | null;
	compiler_options: string | null;
	cpu_extra_time: Numeric | null;
	cpu_time_limit: Numeric | null;
	created_at: Timestamp | null;
	enable_network: boolean | null;
	enable_per_process_and_thread_memory_limit: boolean | null;
	enable_per_process_and_thread_time_limit: boolean | null;
	execution_host: string | null;
	exit_code: number | null;
	exit_signal: number | null;
	expected_output: string | null;
	finished_at: Timestamp | null;
	id: Generated<number>;
	language_id: number | null;
	max_file_size: number | null;
	max_processes_and_or_threads: number | null;
	memory: number | null;
	memory_limit: number | null;
	message: string | null;
	number_of_runs: number | null;
	queue_host: string | null;
	queued_at: Timestamp | null;
	redirect_stderr_to_stdout: boolean | null;
	source_code: string | null;
	stack_limit: number | null;
	started_at: Timestamp | null;
	status_id: number | null;
	stderr: string | null;
	stdin: string | null;
	stdout: string | null;
	time: Numeric | null;
	token: string | null;
	updated_at: Timestamp | null;
	wall_time: Numeric | null;
	wall_time_limit: Numeric | null;
}

export interface DraftSubmissions {
	id: Generated<number>;
	sourcecode: string;
	stdin: string | undefined;
	sent: boolean;
	createdat: Timestamp | undefined;
	updatedat: Timestamp | undefined;
	deletedat: Timestamp | undefined;
}

export interface DB {
	ar_internal_metadata: ArInternalMetadata;
	clients: Clients;
	languages: Languages;
	schema_migrations: SchemaMigrations;
	submissions: Submissions;
	draft_submissions: DraftSubmissions;
}

export function createDB(connectionString: string) {
	return new Kysely<DB>({
		dialect: new PostgresDialect({
			pool: new Pool({
				connectionString,
			}),
		}),
	}).withSchema("public");
}
