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
} from "@phosphor-icons/react";

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
      <MemoryGraph memoryHistory={submissionResult.MemoryHistory ?? []} />
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
          <span>exited with code {submissionResult.ExitCode}</span>
        </div>

        <div className="grid grid-cols-3 gap-2 text-sm mb-4 mt-2">
          <div className="flex items-center">
            <Clock className="mr-1 w-4 h-4" />
            <span>Exec: {submissionResult.Time}s</span>
          </div>
          <div className="flex items-center">
            <Clock className="mr-1 w-4 h-4" />
            <span>Wall: {submissionResult.WallTime}s</span>
          </div>
          <div className="flex items-center">
            <Cpu className="mr-1 w-4 h-4" />
            <span>MemLow: {submissionResult.MemoryMin / 1024 / 1024}s</span>
          </div>
          <div className="flex items-center">
            <MemoryStick className="mr-1 w-4 h-4" />
            <span>MemMax: {submissionResult.MemoryMax / 1024 / 1024}MB</span>
          </div>
          <div className="flex items-center">
            <Calendar className="mr-1 w-4 h-4" />
            <span>
              Created:{" "}
              {new Date(submissionResult.CreatedAt).toLocaleTimeString()}
            </span>
          </div>
          <div className="flex items-center">
            <Calendar className="mr-1 w-4 h-4" />
            <span>
              Updated:{" "}
              {new Date(submissionResult.UpdatedAt).toLocaleTimeString()}
            </span>
          </div>
        </div>

        {submissionResult.Stdout && (
          <div className="mb-4">
            <h5 className="font-semibold mb-2 flex items-center">
              <Terminal className="mr-2" />
              Output:
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
