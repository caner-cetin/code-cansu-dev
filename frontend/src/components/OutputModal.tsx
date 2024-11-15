'use client'
import { useState, useRef, useEffect } from "react";
import {
  useQuery,
  type UseQueryResult,
} from "@tanstack/react-query";
import {
  RefreshCw,
  Clock,
  CheckCircle,
  MemoryStick,
  Cpu,
  Calendar,
  Terminal,
} from "lucide-react";
import {
  BellSimpleSlash,
  Bug,
  ClockClockwise,
  MaskSad,
  QuestionMark,
  Queue,
} from "@phosphor-icons/react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { StoredSubmission } from "@/hooks/useSubmissions";
import toast from "react-hot-toast";
import ShareButton from "./ShareButton";
import { LANGUAGE_CONFIG } from "@/config/languages";
import { Live2D } from "@/scripts/live2d.helpers";
import { States } from "@/services/settings";
import { LoadingSpinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAppContext } from "@/contexts/AppContext";
import type { GetSubmissionResponse } from "@/actions/judge/types";
import { getSubmission, reactSubmission } from "@/actions/judge/calls";

interface OutputModalProps {
  displayingSharedCode: boolean;
  query?: UseQueryResult<GetSubmissionResponse, unknown>;
}

const OutputModal: React.FC<OutputModalProps> = ({ displayingSharedCode, query }) => {
  // Don't set an initial active tab
  const [activeTab, setActiveTab] = useState<string | undefined>(undefined);
  const initialRenderRef = useRef(true);
  // Keep track of the highest submission ID we've seen
  const lastSeenSubmissionRef = useRef<number>(0);
  const [refetchInterval, setRefetchInterval] = useState<number | false>(false);
  const ctx = useAppContext();
  const { setLanguageId, setSourceCode } = ctx;
  // Function to get numeric ID from submission
  const getSubmissionId = (submission: StoredSubmission): number =>
    submission.localId;

  // biome-ignore lint/correctness/useExhaustiveDependencies: <no need to renrender each time getSubmissionID is updated>
  useEffect(() => {
    // Skip the first render
    if (initialRenderRef.current) {
      initialRenderRef.current = false;
      return;
    }
    if (!ctx.submissions) return;
    // Find the highest submission ID in the current list
    const currentMaxId = Math.max(...ctx.submissions.map(getSubmissionId));
    // If we have submissions and found a new highest ID
    if (
      ctx.submissions.length > 0 &&
      currentMaxId > lastSeenSubmissionRef.current
    ) {
      // Find the submission with the highest ID
      const latestSubmission = ctx.submissions.reduce((latest, current) => {
        const currentId = getSubmissionId(current);
        const latestId = getSubmissionId(latest);
        return currentId > latestId ? current : latest;
      });
      // Update our reference and set the active tab
      lastSeenSubmissionRef.current = currentMaxId;
      setActiveTab(latestSubmission.token);
    }
  }, [ctx.submissions]);
  // biome-ignore lint/correctness/useExhaustiveDependencies: <what?>
  useEffect(() => {
    if (displayingSharedCode) {
      const token = query?.data?.token;
      if (token) {
        setActiveTab(token);
      }
    }
  }, [
    displayingSharedCode,
  ]);
  if (!query) {
    query = useQuery({
      queryKey: ["submission", activeTab],
      // biome-ignore lint/style/noNonNullAssertion: <explanation>
      queryFn: () => getSubmission(activeTab!),
      enabled: !!activeTab,
      refetchInterval: (data) => {
        if (
          data.state.data?.status_id === 2 ||
          data.state.data?.status_id === 1
        ) {
          setRefetchInterval(500);
          return 500;
        }
        setRefetchInterval(false);
        return false;
      },
    })
  }
  const { data: submissionResult, isLoading, isError, refetch } = query;

  const handleRefresh = (token: string) => {
    if (token === activeTab) {
      refetch();
    }
  };
  const restoreCode = () => {
    if (!submissionResult) {
      toast.error("No submission result to restore code from");
      return;
    }
    if (!setLanguageId || !setSourceCode) return;
    setLanguageId(submissionResult.language_id);
    setSourceCode(atob(submissionResult.source_code));
  };

  const getStatusIcon = (id: number) => {
    switch (id) {
      case 1:
        return <Queue />;
      case 2:
        return <LoadingSpinner />;
      case 3:
        return <CheckCircle />;
      case 5:
        return <BellSimpleSlash />;
      case 13:
        return <MaskSad />;
      case 14:
        return <QuestionMark />;
      default:
        return <Bug />;
    }
  };

  const renderPerformanceCharts = () => {
    if (!submissionResult) return null;

    const memoryData = [
      { name: "Memory Usage", value: submissionResult.memory },
      { name: "Memory Limit", value: submissionResult.memory_limit },
    ];

    const timeData = [
      {
        name: "Exec Time",
        value: Number.parseFloat(submissionResult.time) * 1000,
      },
      {
        name: "Wall Time",
        value: Number.parseFloat(submissionResult.wall_time) * 1000,
      },
      {
        name: "CPU Time Limit",
        value: Number.parseFloat(submissionResult.cpu_time_limit) * 1000,
      },
    ];

    return (
      <div className="mb-4">
        <h5 className="font-semibold mb-2">Performance Metrics</h5>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h6 className="text-center">Memory Usage (KB)</h6>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={memoryData}>
                <XAxis
                  dataKey="name"
                  angle={-45}
                  textAnchor="end"
                  height={100}
                  interval={0}
                />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div>
            <h6 className="text-center">Time Usage (milliseconds)</h6>
            <ResponsiveContainer width="100%" height={305}>
              <BarChart data={timeData}>
                <XAxis
                  dataKey="name"
                  angle={-45}
                  textAnchor="end"
                  height={105}
                  interval={0}
                />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
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
    setTimeout(async () => {
      await reactSubmission(submissionResult.token)?.then((res) => {
        if (!res) return;
        if (res.message) {
          Live2D.showMessage({
            text: res.message,
            timeout: 5000,
          });
        }
      })
    }, 200);
    return (
      <div className="bg-[#2c2a2a] rounded-lg shadow-lg overflow-auto">
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-lg font-bold flex items-center relative w-full">
            {getStatusIcon(submissionResult.status_id)}
            <span className="ml-2">
              {(() => {
                switch (submissionResult.status_id) {
                  case 1:
                    return "In Queue";
                  case 2:
                    return "Processing";
                  case 3:
                    return "Executed";
                  case 5:
                    return "Time Limit Exceeded";
                  case 6:
                    return "Compilation Error";
                  case 7:
                    return "Runtime Error (SIGSEGV)";
                  case 8:
                    return "Runtime Error (SIGXFSZ)";
                  case 9:
                    return "Runtime Error (SIGFPE)";
                  case 10:
                    return "Runtime Error (SIGABRT)";
                  case 11:
                    return "Runtime Error (NZEC)";
                  case 12:
                    return "Runtime Error (Other)";
                  case 13:
                    return "Internal Error";
                  case 14:
                    return "Exec Format Error";
                  default:
                    return "Lost in the void";
                }
              })()}
            </span>
            {refetchInterval && (
              <span className="text-sm text-gray-400 ml-2">
                Refreshing... Interval: {refetchInterval}ms
              </span>
            )}
            {(!refetchInterval && !displayingSharedCode) && (
              <div className="flex items-center ml-auto">
                <span className="text-sm text-gray-400">
                  <Button
                    variant="secondary"
                    onClick={() => restoreCode()}
                  >
                    <ClockClockwise alt="Restore Code" />
                  </Button>
                </span>
                <ShareButton token={submissionResult.token} />
              </div>
            )}
          </h4>
        </div>

        <div className="text-sm">
          <span className="mr-2 font-extrabold">
            {LANGUAGE_CONFIG[submissionResult.language_id]?.runnerName}
          </span>
          <span>exited with code {submissionResult.exit_code}</span>
        </div>

        <div className="grid grid-cols-3 gap-2 text-sm mb-4 mt-2">
          <div className="flex items-center">
            <Clock className="mr-1 w-4 h-4" />
            <span>Exec: {submissionResult.time}s</span>
          </div>
          <div className="flex items-center">
            <Clock className="mr-1 w-4 h-4" />
            <span>Wall: {submissionResult.wall_time}s</span>
          </div>
          <div className="flex items-center">
            <Cpu className="mr-1 w-4 h-4" />
            <span>Limit: {submissionResult.cpu_time_limit}s</span>
          </div>
          <div className="flex items-center">
            <MemoryStick className="mr-1 w-4 h-4" />
            <span>Mem: {submissionResult.memory}KB</span>
          </div>
          <div className="flex items-center">
            <Calendar className="mr-1 w-4 h-4" />
            <span>
              Created:{" "}
              {new Date(submissionResult.created_at).toLocaleTimeString()}
            </span>
          </div>
          <div className="flex items-center">
            <Calendar className="mr-1 w-4 h-4" />
            <span>
              Finished:{" "}
              {new Date(submissionResult.finished_at).toLocaleTimeString()}
            </span>
          </div>
        </div>

        {submissionResult.stdout && (
          <div className="mb-4">
            <h5 className="font-semibold mb-2 flex items-center">
              <Terminal className="mr-2" />
              Output:
            </h5>
            <pre className="bg-[#3c3836] p-3 rounded overflow-x-auto max-h-96 text-sm">
              {submissionResult.stdout}
            </pre>
          </div>
        )}
        {submissionResult.stderr && (
          <div className="mb-4">
            <h5 className="font-semibold mb-2 text-red-500 flex items-center">
              <Terminal className="mr-2" />
              Error:
            </h5>
            <pre className="bg-[#3c3836] p-3 rounded overflow-x-auto max-h-96 text-red-400 text-sm">
              {submissionResult.stderr}
            </pre>
          </div>
        )}
        {submissionResult.compile_output && (
          <div className="mb-4">
            <h5 className="font-semibold mb-2 flex items-center">
              <Terminal className="mr-2" />
              Compile Output:
            </h5>
            <pre className="bg-[#3c3836] p-3 rounded overflow-x-auto max-h-96 text-sm">
              {submissionResult.compile_output}
            </pre>
          </div>
        )}
        {submissionResult.message && (
          <div className="mb-4">
            <h5 className="font-semibold mb-2 flex items-center">
              <Terminal className="mr-2" />
              Message:
            </h5>
            <pre className="bg-[#3c3836] p-3 rounded overflow-x-auto max-h-96">
              {submissionResult.message}
            </pre>
          </div>
        )}
        {renderPerformanceCharts()}
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
                {activeTab === submission.token && submissionResult?.status_id !== 3 && (
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
          {(!activeTab || ctx.submissions?.length === 0) ?
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
