import React from "react";
import { useState, useRef, useEffect, useCallback } from "react";
import {
  useQuery,
  type UseQueryResult,
} from "@tanstack/react-query";
import {
  RefreshCw,
  Clock,
  CheckCircle,
  MemoryStick,
  Calendar,
  Terminal,
  ChevronsUpDown,
} from "lucide-react";
import {
  BellSimpleSlash,
  Bug,
  ClockClockwise,
  Cpu,
  FloppyDisk,
  Info,
  MaskSad,
} from "@phosphor-icons/react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import type { StoredSubmission } from "@/hooks/useSubmissions";
import toast from "react-hot-toast";
import ShareButton from "./ShareButton";
import { LANGUAGE_CONFIG } from "@/config/languages";
import { Live2D } from "@/scripts/live2d.helpers";
import { LoadingSpinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SubmissionStatus, type GetSubmissionResponse } from "@/services/playground/types";
import { getSubmission, reactSubmission } from "@/services/playground/calls";
import { useAppStore } from "@/stores/AppStore";
import { useEditorContent } from "@/hooks/useCodeEditor";
import { useShallow } from "zustand/react/shallow";
import { useEditorRef } from "@/stores/EditorStore";
import MemoryGraph from "./MemoryGraph";
import CPUMetrics from "./CPUMetrics";
interface OutputModalProps {
  displayingSharedCode: boolean;
  query?: UseQueryResult<GetSubmissionResponse, unknown>;
}

const OutputModal: React.FC<OutputModalProps> = ({ displayingSharedCode, query: initialQuery }) => {
  // First, all store/context hooks
  const ctx = useAppStore(useShallow((state) => ({
    submissions: state.submissions,
    setLanguageId: state.setLanguageId,
    codeStorage: state.codeStorage,
    setCodeStorage: state.setCodeStorage
  })));

  const code = useEditorRef();
  const { loadContent, setMode } = useEditorContent(code, ctx.codeStorage, ctx.setCodeStorage);

  // Then, all useRef hooks
  const initialRenderRef = useRef(true);
  const lastSeenSubmissionRef = useRef<number>(0);

  // Then, all useState hooks
  const [activeTab, setActiveTab] = useState<string | undefined>(undefined);
  const [reacting, setReacting] = useState(false);

  // Then, all useCallback hooks
  const getSubmissionId = useCallback((submission: StoredSubmission): number =>
    submission.localId, []);

  const handleRefresh = useCallback((token: string) => {
    if (token === activeTab) {
      refetch();
    }
  }, [activeTab]);

  // Then, query hooks
  const query = initialQuery || useQuery({
    queryKey: ["submission", activeTab],
    queryFn: () => activeTab ? getSubmission(activeTab) : Promise.reject("No active tab"),
    enabled: !!activeTab,
    refetchInterval: (data) => {
      if (
        data.state.data?.StatusID === SubmissionStatus.Processing
      ) {
        return 500;
      }
      return false;
    },
  });
  const { data: submissionResult, isLoading, isError, refetch } = query;

  const restoreCode = useCallback(() => {
    if (!submissionResult) {
      toast.error("No submission result to restore code from");
      return;
    }
    if (loadContent) loadContent(atob(submissionResult.SourceCode));
    if (setMode) setMode(submissionResult.LanguageID);
  }, [submissionResult, loadContent, setMode]);

  // Finally, all useEffect hooks
  useEffect(() => {
    if (initialRenderRef.current) {
      initialRenderRef.current = false;
      return;
    }
    if (!ctx.submissions) return;

    const currentMaxId = Math.max(...ctx.submissions.map(getSubmissionId));
    if (
      ctx.submissions.length > 0 &&
      currentMaxId > lastSeenSubmissionRef.current
    ) {
      const latestSubmission = ctx.submissions.reduce((latest, current) => {
        const currentId = getSubmissionId(current);
        const latestId = getSubmissionId(latest);
        return currentId > latestId ? current : latest;
      });
      lastSeenSubmissionRef.current = currentMaxId;
      setActiveTab(latestSubmission.token);
    }
  }, [ctx.submissions, getSubmissionId]);

  useEffect(() => {
    if (displayingSharedCode) {
      const token = initialQuery?.data?.Token;
      if (token) {
        setActiveTab(token);
      }
    }
  }, [displayingSharedCode, initialQuery?.data?.Token]);

  useEffect(() => {
    if (submissionResult !== undefined && !reacting) {
      setReacting(true);
      reactSubmission(submissionResult.Token)?.then((res) => {
        Live2D.showMessage({
          text: res || "zzz...",
          timeout: 3000,
        });
      }).finally(() => {
        setReacting(false);
      });
    }
  }, [submissionResult, reacting]);
  const getStatusIcon = (id: number) => {
    switch (id) {
      case SubmissionStatus.Processing:
        return <LoadingSpinner />;
      case SubmissionStatus.Executed:
        return <CheckCircle />;
      case SubmissionStatus.Failed:
        return <MaskSad />;;
      case SubmissionStatus.TimeLimitExceeded:
        return <BellSimpleSlash />;
      default:
        return <Bug />;
    }
  };

  const renderPerformanceCharts = () => {
    if (!submissionResult) return null;
    return (
      <>
        <div className="space-y-5">
          <Collapsible>
            <div className="flex items-center">
              <Cpu className="w-4 h-4 mr-2" />
              <h4 className="font-bold">
                CPU Metrics
              </h4>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="sm" className="w-9 p-0">
                  <ChevronsUpDown className="h-4 w-4" />
                  <span className="sr-only">Collapse CPU Metrics</span>
                </Button>
              </CollapsibleTrigger>
            </div>
            <CollapsibleContent>
              <CPUMetrics cpuHistoryBase64={submissionResult.CpuHistory} />
            </CollapsibleContent>
          </Collapsible>
          <Collapsible>
            <div className="flex items-center">
              <MemoryStick className="w-4 h-4 mr-2" />
              <h4 className="font-bold">
                Memory Metrics
              </h4>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="sm" className="w-9 p-0">
                  <ChevronsUpDown className="h-4 w-4" />
                  <span className="sr-only">Collapse Memory Metrics</span>
                </Button>
              </CollapsibleTrigger>
            </div>
            <CollapsibleContent>
              <MemoryGraph memoryHistory={submissionResult.MemoryHistory ?? []} />

            </CollapsibleContent>
          </Collapsible>

        </div>
      </>
    );
  };
  const renderSubmissionResult = () => {
    if (isLoading) return <LoadingSpinner />;
    if (isError)
      return (
        <div className="text-red-500">Error fetching submission result</div>
      );
    if (!submissionResult) return null;
    if (isError)
      return (
        <div className="text-red-500">Error fetching submission result</div>
      );
    return (
      <div className="bg-[#2c2a2a] rounded-lg shadow-lg overflow-auto">
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-lg font-bold flex items-center relative w-full">
            {getStatusIcon(submissionResult.StatusID)}
            <span className="ml-2">
              {(() => {
                switch (submissionResult.StatusID) {
                  case 0:
                    return "Processing";
                  case 1:
                    return "Executed";
                  case 2:
                    return "Failed";
                  case 3:
                    return "Time Limit Exceeded";
                  default:
                    return "Lost in the void";
                }
              })()}
            </span>
            {submissionResult.StatusID == SubmissionStatus.Processing && (
              <span className="text-sm text-gray-400 ml-2">
                Refreshing...
              </span>
            )}
            {(!displayingSharedCode) && (
              <div className="flex items-center ml-auto">
                <span className="text-sm text-gray-400 mr-2">
                  {new Date(submissionResult.CreatedAt).toLocaleTimeString()}
                  <Button
                    variant="secondary"
                    onClick={() => restoreCode()}
                  >
                    <ClockClockwise alt="Restore Code" />
                  </Button>
                </span>
                <ShareButton uri={`${import.meta.env.VITE_FRONTEND_URI}/share/${activeTab}`} />
              </div>
            )}
          </h4>
        </div>

        <div className="text-sm">
          <span className="mr-2 font-extrabold">
            {LANGUAGE_CONFIG[submissionResult.LanguageID]?.runnerName}
          </span>
          <span>exited with code {submissionResult.ExitCode} </span>
        </div>

        <div className="grid grid-cols-3 gap-2 text-sm mb-4 mt-2">
          <div className="flex items-center gap-1">
            <Clock className="mr-1 w-4 h-4" />
            <TooltipProvider delayDuration={200}>
              <Tooltip>
                <TooltipTrigger>
                  <Info className="cursor-pointer w-4 h-4" />
                </TooltipTrigger>
                <TooltipContent className="bg-[#1a1a1a] border-none border-r-8 text-white max-w-64">
                  <p>
                    <span className="font-extrabold">
                      Does not include compilation time, measured from run command only.
                    </span>

                    <br />
                    <br />

                    Refers to the wall clock time i.e the time taken from the start of the program to finish and includes even the time slices taken by
                    other processes when the kernel context switches them. It also includes any time, the process is blocked (on I/O events, etc.)

                    <br />
                    <br />

                    <a href="https://stackoverflow.com/a/15427275/22757599" className="underline">source</a>
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <span>Real: {submissionResult.TimingReal} ms</span>

          </div>
          <div className="flex items-center gap-1">
            <Clock className="mr-1 w-4 h-4" />
            <TooltipProvider delayDuration={200}>
              <Tooltip>
                <TooltipTrigger>
                  <Info className="cursor-pointer w-4 h-4" />
                </TooltipTrigger>
                <TooltipContent className="bg-[#1a1a1a] border-none border-r-8 text-white max-w-64 overflow-x-auto">
                  <span className="font-extrabold">
                    Does not include compilation time, measured from run command only.
                  </span>
                  <br />
                  <br />

                  <p>
                    Refers to the CPU time spent in the user space, i.e. outside the kernel. Unlike the real time, it refers to only the CPU cycles taken by the process, including the time it is blocked.

                    <br />
                    <br />

                    <a href="https://stackoverflow.com/a/15427275/22757599" className="underline">source</a>
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <span>User: {submissionResult.TimingUser} ms</span>

          </div>
          <div className="flex items-center gap-1">
            <Clock className="mr-1 w-4 h-4" />
            <TooltipProvider delayDuration={200}>
              <Tooltip>
                <TooltipTrigger>
                  <Info className="cursor-pointer w-4 h-4" />
                </TooltipTrigger>
                <TooltipContent className="bg-[#1a1a1a] border-none border-r-8 text-white max-w-64 overflow-x-auto">
                  <span className="font-extrabold">
                    Does not include compilation time, measured from run command only.
                  </span>
                  <br />
                  <br />

                  <p>
                    Refers to the CPU time spent in the kernel space, (as part of system calls). This is only counting the CPU cycles spent in kernel space on behalf of the process and not any time it is blocked.

                    <br />
                    <br />

                    <a href="https://stackoverflow.com/a/15427275/22757599" className="underline">source</a>
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <span>Sys: {submissionResult.TimingSys} ms</span>

          </div>
          <div className="flex items-center">
            <MemoryStick className="mr-1 w-4 h-4" />
            <TooltipProvider delayDuration={200}>
              <Tooltip>
                <TooltipTrigger>
                  <Info className="cursor-pointer w-4 h-4" />
                </TooltipTrigger>
                <TooltipContent className="bg-[#1a1a1a] border-none border-r-8 text-white max-w-64 overflow-x-auto">
                  <p>
                    Bytes of memory used by the program at its peak. This includes all the memory used by the program, including the operating system during the program's execution.
                    <br />
                    For example, when you run a Nim program, you may see an output like this:
                    <br />
                    <br />
                    <span className="italic">
                      42956 lines; 0.865s; 59.09MiB peakmem; proj: /main.nim; out: /main

                    </span>
                    <br />
                    <br />
                    Where peak memory shown by compiler is 59.09 megabytes but the peak shown in the output is 85.813 MB. That is caused by the memory used by the operating system, compiler, and every process within the lifetime of
                    runner.
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <span>Peak Memory: <br /> {(submissionResult.MemoryMax / 1024 / 1024).toFixed(3)}MB</span>

          </div>
          <div className="flex items-center gap-1">
            <FloppyDisk className="mr-1 w-4 h-4" />
            <TooltipProvider delayDuration={200}>
              <Tooltip>
                <TooltipTrigger>
                  <Info className="cursor-pointer w-4 h-4" />
                </TooltipTrigger>
                <TooltipContent className="bg-[#1a1a1a] border-none border-r-8 text-white max-w-64 overflow-x-auto">
                  <p>
                    Bytes of read input written to disk and bytes of output written to disk by the program. This includes all the I/O operations done by the program, including the operating system during the program's execution.
                    <br />
                    <br />
                    Bytes:
                    <br />
                    ---------
                    <br />
                    Read: {submissionResult.IoReadBytes} / Write: {submissionResult.IoWriteBytes}
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <span>IO R/W MB: <br /> R:{(submissionResult.IoReadBytes * 0.001).toFixed(2)} <br /> W:{(submissionResult.IoWriteBytes * 0.001).toFixed(2)} </span>

          </div>
          <div className="flex items-center gap-1">
            <FloppyDisk className="mr-1 w-4 h-4" />
            <TooltipProvider delayDuration={200}>
              <Tooltip>
                <TooltipTrigger>
                  <Info className="cursor-pointer w-4 h-4" />
                </TooltipTrigger>
                <TooltipContent className="bg-[#1a1a1a] border-none border-r-8 text-white max-w-64 overflow-x-auto">
                  <p>
                    Total number of read and write operations done by the program. This includes all the I/O operations done by the program, including the operating system during the program's execution.
                    <br />
                    <br />
                    This includes every operation during runner's lifetime, such as saving the source code, reading the input, writing the output, etc.
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <span>IO R/W: <br /> {submissionResult.IoReadCount}/{submissionResult.IoWriteCount}</span>

          </div>
        </div>
        {renderPerformanceCharts()}

        {submissionResult.Stdout && (
          <div className="mb-4 mt-4">
            <h5 className="font-semibold mb-2 flex items-center">
              <Terminal className="mr-2" />
              Stdout:
            </h5>
            <pre className="bg-[#3c3836] p-3 rounded overflow-x-auto max-h-96 text-sm">
              {submissionResult.Stdout}
            </pre>
          </div>
        )}
        {submissionResult.Stderr && (
          <div className="mb-4">
            <h5 className="font-semibold mb-2 flex items-center">
              <Terminal className="mr-2" />
              Stderr:
            </h5>
            <pre className="bg-[#3c3836] p-3 rounded overflow-x-auto max-h-96 text-sm">
              {submissionResult.Stderr}
            </pre>
          </div>
        )}

      </div>
    );
  };
  const renderSubmissionTabs = () => {
    return <div className="flex flex-col">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-2">
          {displayingSharedCode ? (
            <TabsTrigger value="output">Output</TabsTrigger>
          ) : (
            ctx.submissions?.map((submission) => (
              <TabsTrigger key={submission.token} value={submission.token} className="flex items-center gap-2">
                <i className={submission.iconClass} />
                <span>{submission.localId}</span>
                {activeTab === submission.token && submissionResult?.StatusID !== 3 && (
                  <RefreshCw
                    size={14}
                    className="cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleRefresh(submission.token)
                    }}
                  />
                )}
              </TabsTrigger>
            ))
          )}
        </TabsList>
        {displayingSharedCode && (
          <TabsContent value="output">
            {/* Content for shared code output */}
            <div>Shared code output</div>
          </TabsContent>
        )}
      </Tabs>
    </div>
  };
  return (
    <>
      <div className="output-modal h-full max-h-screen flex flex-col overflow-hidden">
        <div className="flex-none">{ctx.submissions && renderSubmissionTabs()}</div>
        <div className="flex-1 overflow-auto">
          {((!activeTab || ctx.submissions?.length === 0) && !displayingSharedCode) ?
            <div className="flex items-center justify-center h-full text-gray-500">
              <div className="text-center">
                <p className="mb-2">No submission selected</p>
                <p className="text-sm">
                  Select a submission to view results or execute code to create a
                  new submission
                </p>
              </div>
            </div> : renderSubmissionResult()}
        </div>
      </div>
    </>
  );
};

export default OutputModal;
