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
import { LoadingSpinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { GetSubmissionResponse } from "@/services/judge/types";
import { getSubmission, reactSubmission } from "@/services/judge/calls";
import { useAppStore } from "@/stores/AppStore";
import { useEditorContent } from "@/hooks/useCodeEditor";
import { useShallow } from "zustand/react/shallow";
import { useEditorRef } from "@/stores/EditorStore";

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
  const { saveContent, loadContent, setMode } = useEditorContent(code, ctx.codeStorage, ctx.setCodeStorage);

  // Then, all useRef hooks
  const initialRenderRef = useRef(true);
  const lastSeenSubmissionRef = useRef<number>(0);

  // Then, all useState hooks
  const [activeTab, setActiveTab] = useState<string | undefined>(undefined);
  const [refetchInterval, setRefetchInterval] = useState<number | false>(false);
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
        data.state.data?.status_id === 2 ||
        data.state.data?.status_id === 1
      ) {
        setRefetchInterval(500);
        return 500;
      }
      setRefetchInterval(false);
      return false;
    },
  });
  const { data: submissionResult, isLoading, isError, refetch } = query;

  const restoreCode = useCallback(() => {
    if (!submissionResult) {
      toast.error("No submission result to restore code from");
      return;
    }
    if (loadContent) loadContent(atob(submissionResult.source_code));
    if (setMode) setMode(submissionResult.language_id);
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
      const token = initialQuery?.data?.token;
      if (token) {
        setActiveTab(token);
      }
    }
  }, [displayingSharedCode, initialQuery?.data?.token]);

  useEffect(() => {
    if (submissionResult !== undefined && !reacting) {
      setReacting(true);
      reactSubmission(submissionResult.token)?.then((res) => {
        if (!res) return;
        if (res.message) {
          Live2D.showMessage({
            text: res.message,
            timeout: 3000,
          });
        }
      }).finally(() => {
        setReacting(false);
      });
    }
  }, [submissionResult, reacting]);
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
