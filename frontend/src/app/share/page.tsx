"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from 'next/navigation'
import CustomToast from "@/components/CustomToast";
import Header from "@/components/Header";
import OutputModal from "@/components/OutputModal";
import { LanguageId } from "@/services/settings";
import { useAppContext } from "@/contexts/AppContext";
import { getLanguages, getSubmission } from "@/actions/judge/calls";
import { isMobile } from "@/hooks/useMobile";
import { AceEditor } from "@/components/AceEditor";

export default function SharedCodePage() {
  const token = useSearchParams().get("token")
  if (!token) {
    return <div className="min-h-screen bg-[#211e20] text-[#e9efec] font-mono flex items-center justify-center">
      <h1 className="text-2xl text-center">
        Invalid share link.
      </h1>
    </div>
  }
  const [mobile, setMobile] = useState(false)
  const ctx = useAppContext();


  useEffect(() => {
    setMobile(isMobile())
  }, [])
  if (mobile) {
    return (
      <div className="min-h-screen bg-[#211e20] text-[#e9efec] font-mono flex items-center justify-center">
        <h1 className="text-2xl text-center">
          Not usable on mobile/tablets. Sorry.
        </h1>
      </div>
    );
  }
  const query = useQuery({
    queryKey: ["submission", token],
    queryFn: () => getSubmission(token),
    refetchInterval: false,
    staleTime: Number.POSITIVE_INFINITY,
    enabled: !!token,
  });


  // biome-ignore lint/correctness/useExhaustiveDependencies: <setters wont change>
  useEffect(() => {
    ctx.setDisplayingSharedCode(true);
    if (!ctx.setSourceCode || !query) return;
    const sc = query.data?.source_code
    ctx.setSourceCode(sc ? atob(sc) : "// No source code found")
  }, [query.data]);



  return (
    <div className="min-h-screen bg-[#211e20] text-[#e9efec] font-mono flex flex-col">
      <CustomToast />
      <Header />
      <PanelGroup direction="horizontal" className="flex-1">
        <Panel defaultSize={70} minSize={30}>
          <div className="h-full bg-[#1e1e1e] overflow-hidden">
            <AceEditor displayingSharedCode={true} />
          </div>
        </Panel>
        <PanelResizeHandle className="w-2 bg-[#3c3836] hover:bg-[#504945] cursor-col-resize" />
        <Panel defaultSize={30} minSize={20}>
          <div className="h-full bg-[#2c2a2a] p-4 overflow-y-auto">
            <OutputModal displayingSharedCode={true} query={query} />
          </div>
        </Panel>
      </PanelGroup>
    </div>
  );
}