-- name: CreateSubmission :exec
INSERT INTO public.submissions
(id, source_code, language_id, "stdin", "stdout", status_id, "time", memory, memory_history, memory_min, memory_max, kernel_stack_bytes, page_faults, major_page_faults, io_read_bytes, io_write_bytes, io_read_count, io_write_count, oom, oom_kill, voluntary_context_switch, involuntary_context_switch, "token", max_file_size, exit_code, wall_time, compiler_options, command_line_arguments, additional_files, created_at, updated_at, stderr)
VALUES(nextval('submissions_id_seq'::regclass), $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29, $30, $31);

-- name: UpdateSubmissionWithResult :exec
UPDATE 
  public.submissions 
SET 
  "stdin" = $1, 
  "stdout" = $2, 
  status_id = $3, 
  "time" = $4, 
  memory = $5, 
  memory_history = $6, 
  memory_min = $7, 
  memory_max = $8, 
  kernel_stack_bytes = $9, 
  page_faults = $10, 
  major_page_faults = $11, 
  io_read_bytes = $12, 
  io_write_bytes = $13, 
  io_read_count = $14, 
  io_write_count = $15, 
  oom = $16, 
  oom_kill = $17, 
  voluntary_context_switch = $18, 
  involuntary_context_switch = $19, 
  exit_code = $20, 
  wall_time = $21, 
  compiler_options = $22, 
  command_line_arguments = $23, 
  additional_files = $24, 
  updated_at = $25,
  stderr = $26
WHERE 
  token = $27;

-- name: UpdateSubmissionStatus :exec
UPDATE
  public.submissions
SET 
  status_id = $1
WHERE
  token = $2;

-- name: GetSubmission :one
SELECT id, source_code, language_id, "stdin", "stdout", status_id, "time", memory, memory_history, memory_min, memory_max, kernel_stack_bytes, page_faults, major_page_faults, io_read_bytes, io_write_bytes, io_read_count, io_write_count, oom, oom_kill, voluntary_context_switch, involuntary_context_switch, "token", max_file_size, exit_code, wall_time, compiler_options, command_line_arguments, additional_files, created_at, updated_at, stderr
FROM public.submissions
WHERE token = $1;

-- name: InsertSubmissionAiReaction :exec
INSERT INTO public.submission_ai_reactions
(id, reaction, created_at, updated_at, judgetoken)
VALUES(nextval('submission_ai_reactions_id_seq'::regclass), $1, now(), now(), $2);

-- name: QuerySubmissionAiReaction :one
SELECT id, reaction, created_at, updated_at, deleted_at, judgetoken
FROM public.submission_ai_reactions
WHERE judgetoken = $1;