import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import {
	type GetSubmissionResponse,
	Judge0,
	type LanguagesResponse,
} from "./judge0";
import dayjs from "dayjs";
import { HTTPException } from "hono/http-exception";
import { createDB, Submissions } from "./db";
import { rateLimiter } from "./middlewares/ratelimit";
export type Bindings = {
	DATABASE_URL: string;
	JWT_SECRET: string;
	JWT_REFRESH_SECRET: string;
	JUDGE0_BASE_API_URL: string;
	JUDGE0_AUTHZ_HEADER: string;
	JUDGE0_AUTHZ_TOKEN: string;
	JUDGE0_AUTHN_HEADER: string;
	JUDGE0_AUTHN_TOKEN: string;
	HF_MODEL_URL: string;
	HF_TOKEN: string;
	// @ts-ignore
	RATE_LIMIT_KV: KVNamespace;
};

const app = new Hono<{ Bindings: Bindings }>();
app.use("*", logger());
app.use(
	"*",
	cors({
		origin: [
			"https://code.cansu.dev",
			"http://localhost:5173",
			"http://localhost:4173",
		],
		credentials: false,
		maxAge: 600,
		allowMethods: ["POST", "GET", "OPTIONS", "PUT"],
		allowHeaders: ["Content-Type", "Authorization"],
		exposeHeaders: ["Content-Length"],
	}),
);
app.options("*", (c) => {
	c.header("Access-Control-Allow-Origin", c.req.header("Origin") || "*");
	c.header("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT");
	c.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
	c.header("Access-Control-Max-Age", "600");
	return c.text("", 204);
});
app.get("/health", async (c) => {
	return c.redirect("https://www.youtube.com/watch?v=vaLqF54Ae10");
});

app.get("/judge/languages", async (c) => {
	const db = createDB(c.env.DATABASE_URL);
	const languages = await db
		.selectFrom("languages")
		.select(["id", "name"])
		.where("is_archived", "=", false)
		.execute();
	return c.json(languages as LanguagesResponse[]);
});

app.post("/judge/submit/code", async (c) => {
	const code = await c.req.text();

	if (!code) {
		throw new HTTPException(400, { message: "beep beep invalid input" });
	}
	const db = createDB(c.env.DATABASE_URL);

	const subId = await db
		.insertInto("draft_submissions")
		.values({
			sourcecode: Buffer.from(code).toString("base64"),
			stdin: undefined,
			sent: false,
			createdat: dayjs(),
			updatedat: dayjs(),
			deletedat: undefined,
		})
		.returning("id")
		.execute();

	return c.json({ id: subId[0].id });
});

app.post("/judge/submit/stdin", async (c) => {
	const id = c.req.query("id");
	const stdin = await c.req.text();

	if (!stdin || !id) {
		throw new HTTPException(400, {
			message: "both stdin and id cannot be null",
		});
	}
	const db = createDB(c.env.DATABASE_URL);
	await db
		.updateTable("draft_submissions")
		.set({
			stdin: Buffer.from(stdin).toString("base64"),
			updatedat: dayjs(),
		})
		.where("id", "=", Number(id))
		.execute();

	return c.json({ success: true });
});
app.put("/judge/submit/:id", rateLimiter, async (c) => {
	const id = c.req.param("id");
	const language = Number(c.req.query("language"));
	const db = createDB(c.env.DATABASE_URL);
	const submission = await db
		.selectFrom("draft_submissions")
		.select(["sourcecode", "stdin", "sent"])
		.where("id", "=", Number(id))
		.executeTakeFirst();
	if (submission?.sent === true) {
		throw new HTTPException(400, { message: "Submission already sent" });
	}
	if (!submission) {
		throw new HTTPException(400, { message: "Invalid submission ID" });
	}

	const result = await Judge0.Submission.create(
		submission.sourcecode,
		language,
		submission.stdin ?? btoa(""),
		true,
		false,
		c,
	);

	await db
		.deleteFrom("draft_submissions")
		.where("id", "=", Number(id))
		.execute();

	return c.json(result);
});

app.get("/judge/:token", async (c) => {
	const db = createDB(c.env.DATABASE_URL);
	const token = c.req.param("token");
	const submission = await db
		.selectFrom("submissions")
		.select([
			"source_code",
			"language_id",
			"stdin",
			"stdout",
			"status_id",
			"created_at",
			"finished_at",
			"time",
			"memory",
			"stderr",
			"token",
			"number_of_runs",
			"cpu_time_limit",
			"cpu_extra_time",
			"wall_time_limit",
			"memory_limit",
			"stack_limit",
			"max_file_size",
			"compile_output",
			"message",
			"exit_code",
			"wall_time",
		])
		.where("token", "=", token)
		.executeTakeFirst();
	if (!submission) {
		throw new HTTPException(400, { message: "Submission not found" });
	}
	return c.json(submission as GetSubmissionResponse);
});

app.post("/react/code", async (c) => {
	const code = await c.req.text();
	const db = createDB(c.env.DATABASE_URL);
	const saved_reaction = await db
		.selectFrom("code_ai_reactions")
		.select(["reaction"])
		.where("code", "=", code)
		.executeTakeFirst();
	if (saved_reaction) {
		return c.json({ message: saved_reaction.reaction });
	}
	let response = "";
	const prompt = `You are an enthusiastic fan of programming,professional cheerleader, and a cute anime girl.  Following context is source code, react to the source code in a cute way.
    Keep it very short, limit yourself to maximum 2 sentences and limit the sentences to very short, this reaction is intended to show in a dialogue box. 
		Try to be as creative as possible, don't be afraid to be funny or silly (except misinformation or offensive content),
		you are free to say whatever you want, just do not repeat yourself. Do not use emojis. Do not make assumptions like "this must be a complex program, this must be X" only react to what you see. Do not be too ordinary, such
		as "Yeah! I see the code is running, good job!" or artifical sounding reactions "Oh my gosh", be more creative, be yourself, you are a cute anime girl.
		Do not comment on the thinking process, such as "i am busy encoding the source code", just react to the source code and the run.
		You are currently looking at an ongoing and draft code, so feel free to comment on how the code is going.

		Return the answer in json format, {
			"message": "your reaction"
		} after the Answer: part, so your response will look like Answer: {"message": "your reaction"}

    Context: ${code}
    Answer:
    `;
	await fetch(c.env.HF_MODEL_URL, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${c.env.HF_TOKEN}`,
		},
		body: JSON.stringify({
			inputs: prompt,
			parameteres: {
				do_sample: true,
				top_k: 50,
				top_p: 0.95,
				temperature: 0.8,
			},
		}),
	}).then(async (res) => {
		const data = await res.json();
		// delete anything before Answer:
		response = data[0].generated_text.split("Answer:\n")[1].trim();
		// delete anything after last }
		response = `${response.split("}")[0]}}`;
		response = JSON.parse(response).message;
	});
	if (response !== "") {
		await db
			.insertInto("code_ai_reactions")
			.values({
				code,
				reaction: response,
				created_at: dayjs(),
				updated_at: dayjs(),
			})
			.execute();
	}
	return c.json({ message: response });
});

app.post("/react/submission/:token", async (c) => {
	const token = c.req.param("token");
	const db = createDB(c.env.DATABASE_URL);
	const saved_reaction = await db
		.selectFrom("submission_ai_reactions")
		.select(["reaction"])
		.where("judgetoken", "=", token)
		.executeTakeFirst();
	if (saved_reaction) {
		return c.json({ message: saved_reaction.reaction });
	}
	let response = "";
	const submission = await db
		.selectFrom("submissions")
		.select([
			"source_code",
			"wall_time",
			"wall_time_limit",
			"memory",
			"memory_limit",
			"wall_time",
		])
		.where("token", "=", token)
		.executeTakeFirst();
	if (!submission) {
		throw new HTTPException(400, { message: "Submission not found" });
	}
	const prompt = `You are an enthusiastic fan of programming,professional cheerleader, and a cute anime girl. Following context is a source code, react to the source code in a cute way.
		Keep it very short, limit yourself to maximum 2 sentences and limit the sentences to very short, this reaction is intended to show in a dialogue box. 
		Try to be as creative as possible, don't be afraid to be funny or silly (except misinformation or offensive content),
		you are free to say whatever you want, just do not repeat yourself. Do not use emojis. Do not make assumptions like "this must be a complex program, this must be X" only react to what you see. Do not be too ordinary, such
		as "Yeah! I see the code is running, good job!" or artifical sounding reactions "Oh my gosh", be more creative, be yourself, you are a cute anime girl. Do not comment on the thinking process, such as "i am busy encoding the source code", just react to the source code and the run.

		Source code is finished running, so here are some more details in addition to the source code that might help you:
		- Wall Time: ${submission.wall_time}
		- Wall Time Limit: ${submission.wall_time_limit}
		- Memory: ${submission.memory}
		- Memory Limit: ${submission.memory}
		Do not use them forcefully, only use them when you see fit.
		
		Return the answer in json format, {
			"message": "your reaction"
		} after the Answer: part, so your response will look like Answer: {"message": "your reaction"}

		Context: ${submission.source_code}
		Answer:
		`;

	await fetch(c.env.HF_MODEL_URL, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${c.env.HF_TOKEN}`,
		},
		body: JSON.stringify({
			inputs: prompt,
			parameteres: {
				do_sample: true,
				top_k: 50,
				top_p: 0.95,
				temperature: 0.8,
			},
		}),
	}).then(async (res) => {
		const data = await res.json();
		// delete anything before Answer:
		response = data[0].generated_text.split("Answer:\n")[1].trim();
		// delete anything after last }
		response = `${response.split("}")[0]}}`;
		response = JSON.parse(response).message;
	});
	if (response !== "") {
		await db
			.insertInto("submission_ai_reactions")
			.values({
				judgetoken: token,
				reaction: response,
				created_at: dayjs(),
				updated_at: dayjs(),
			})
			.execute();
	}
	return c.json({ message: response });
});

app.onError((err, c) => {
	console.error(err);
	const status = err instanceof HTTPException ? err.status : 500;
	const message =
		err instanceof HTTPException ? err.message : "Internal Server Error";

	return c.json(
		{
			status,
			message,
		},
		status,
	);
});
export type AppType = typeof app;

// Start the worker
export default app;
