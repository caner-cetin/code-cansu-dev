-- public.ar_internal_metadata definition

-- Drop table

-- DROP TABLE public.ar_internal_metadata;

CREATE TABLE public.ar_internal_metadata (
	"key" varchar NOT NULL,
	value varchar NULL,
	created_at timestamp NOT NULL,
	updated_at timestamp NOT NULL,
	CONSTRAINT ar_internal_metadata_pkey PRIMARY KEY (key)
);


-- public.clients definition

-- Drop table

-- DROP TABLE public.clients;

CREATE TABLE public.clients (
	id varchar NOT NULL,
	CONSTRAINT clients_pkey PRIMARY KEY (id)
);


-- public.code_ai_reactions definition

-- Drop table

-- DROP TABLE public.code_ai_reactions;

CREATE TABLE public.code_ai_reactions (
	id serial4 NOT NULL,
	code text NULL,
	reaction text NULL,
	created_at timestamptz DEFAULT now() NOT NULL,
	updated_at timestamptz DEFAULT now() NOT NULL,
	deleted_at timestamptz NULL,
	CONSTRAINT code_ai_reactions_pkey PRIMARY KEY (id)
);


-- public.draft_submissions definition

-- Drop table

-- DROP TABLE public.draft_submissions;

CREATE TABLE public.draft_submissions (
	id serial4 NOT NULL,
	sourcecode text NOT NULL,
	"stdin" text NULL,
	sent bool DEFAULT false NOT NULL,
	createdat timestamptz DEFAULT now() NOT NULL,
	updatedat timestamptz DEFAULT now() NOT NULL,
	deletedat timestamptz NULL,
	CONSTRAINT draft_submissions_pkey PRIMARY KEY (id)
);

-- public.schema_migrations definition

-- Drop table

-- DROP TABLE public.schema_migrations;

CREATE TABLE public.schema_migrations (
	"version" varchar NOT NULL,
	CONSTRAINT schema_migrations_pkey PRIMARY KEY (version)
);


-- public.submission_ai_reactions definition

-- Drop table

-- DROP TABLE public.submission_ai_reactions;

CREATE TABLE public.submission_ai_reactions (
	id serial4 NOT NULL,
	reaction text NOT NULL,
	created_at timestamptz DEFAULT now() NOT NULL,
	updated_at timestamptz DEFAULT now() NOT NULL,
	deleted_at timestamptz NULL,
	judgetoken text NOT NULL,
	CONSTRAINT submission_ai_reactions_pkey PRIMARY KEY (id)
);


-- public.submissions definition

-- Drop table

-- DROP TABLE public.submissions;

CREATE TABLE public.submissions (
	id serial4 NOT NULL,
	source_code text NULL,
	language_id int4 NULL,
	"stdin" text NULL,
	expected_output text NULL,
	"stdout" text NULL,
	status_id int4 NULL,
	created_at timestamp NULL,
	finished_at timestamp NULL,
	"time" numeric NULL,
	memory int4 NULL,
	stderr text NULL,
	"token" varchar NULL,
	number_of_runs int4 NULL,
	cpu_time_limit numeric NULL,
	cpu_extra_time numeric NULL,
	wall_time_limit numeric NULL,
	memory_limit int4 NULL,
	stack_limit int4 NULL,
	max_processes_and_or_threads int4 NULL,
	enable_per_process_and_thread_time_limit bool NULL,
	enable_per_process_and_thread_memory_limit bool NULL,
	max_file_size int4 NULL,
	compile_output text NULL,
	exit_code int4 NULL,
	exit_signal int4 NULL,
	message text NULL,
	wall_time numeric NULL,
	compiler_options varchar NULL,
	command_line_arguments varchar NULL,
	redirect_stderr_to_stdout bool NULL,
	callback_url varchar NULL,
	additional_files bytea NULL,
	enable_network bool NULL,
	started_at timestamp NULL,
	queued_at timestamp NULL,
	updated_at timestamp NULL,
	queue_host varchar NULL,
	execution_host varchar NULL,
	CONSTRAINT submissions_pkey PRIMARY KEY (id)
);
CREATE INDEX index_submissions_on_token ON public.submissions USING btree (token);