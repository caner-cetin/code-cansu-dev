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
	"stdout" text NULL,
	status_id int4 NULL,
	"time" real NULL,
	memory int4 NULL,
	memory_history int4[] NULL,
	memory_min int4 NULL,
	memory_max int4 NULL,
	kernel_stack_bytes int4 NULL,
	page_faults int4 NULL,
	major_page_faults int4 NULL,
	io_read_bytes int4 NULL,
	io_write_bytes int4 NULL,
	io_read_count int4 NULL,
	io_write_count int4 NULL,
	oom int4 NULL,
	oom_kill int4 NULL,
	voluntary_context_switch int4 NULL,
	involuntary_context_switch int4 NULL,
	"token" varchar NULL,
	max_file_size int4 NULL,
	exit_code int4 NULL,
	wall_time real NULL,
	compiler_options varchar NULL,
	command_line_arguments varchar NULL,
	additional_files bytea NULL,
	created_at timestamp NULL,
	updated_at timestamp NULL,
	CONSTRAINT submissions_pkey PRIMARY KEY (id)
);
CREATE INDEX index_submissions_on_token ON public.submissions USING btree (token);