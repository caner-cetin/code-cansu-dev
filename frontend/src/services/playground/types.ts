export type LanguagesResponse = Array<{
	id: number;
	name: string;
}>;


export type ExecuteCodeResponse = {
	id: string;
};

export interface ExecuteCodeRequest {
	language: number;
	code: string;
	stdin: string | undefined;
	compilerOptions: string | undefined;
	commandLineArguments: string | undefined;
}

export enum SubmissionStatus {
  Processing = 0,
  Executed = 1,
  Failed = 2,
  TimeLimitExceeded = 3,
}

export interface GetSubmissionResponse {
  ID: number
  SourceCode: string
  LanguageID: number
  Stdin: string
  Stdout: string
  Stderr: string
  StatusID: number
  Time: number
  Memory: number
  MemoryHistory?: number[]
  MemoryMin: number
  MemoryMax: number
  KernelStackBytes: number
  PageFaults: number
  MajorPageFaults: number
  IoReadBytes: number
  IoWriteBytes: number
  IoReadCount: number
  IoWriteCount: number
  Oom: number
  OomKill: number
  VoluntaryContextSwitch: number
  InvoluntaryContextSwitch: number
  Token: string
  MaxFileSize: any
  ExitCode: number
  CompilerOptions: any
  CommandLineArguments: any
  AdditionalFiles: any
  CreatedAt: string
  UpdatedAt: string
  // b64
  CpuHistory: string
  CpuAverage: number
  CpuMax: number
  TimingReal: number
  TimingUser: number
  TimingSys: number
}

export type ReactCodeResponse = {
	message: string;
};
