"use client";

import React, { useCallback, useEffect } from "react";
import { useCodeEditor } from "@/hooks/useCodeEditor";
import { useAppContext } from "@/contexts/AppContext";
import AceEditorComponent from "react-ace";
// unfortunately, i cannot use dynamic import for ace-builds
// i will find a way to do so, but initial load is around 1.6 MB, and with cached, network transfer is around 4 KB, so it is not a big deal. for now.
// ========================
import "ace-builds/src-min-noconflict/ext-language_tools";
import "ace-builds/src-min-noconflict/ext-settings_menu";
import "ace-builds/src-min-noconflict/ext-searchbox";
import "ace-builds/src-min-noconflict/ext-statusbar";
import "ace-builds/src-min-noconflict/ext-code_lens";
import "ace-builds/src-min-noconflict/ext-error_marker";
import "ace-builds/src-min-noconflict/ext-static_highlight";
import "ace-builds/src-min-noconflict/ext-emmet";

// ========================
import "ace-builds/src-min-noconflict/mode-assembly_x86";
import "ace-builds/src-min-noconflict/mode-sh";
import "ace-builds/src-min-noconflict/mode-c_cpp";
import "ace-builds/src-min-noconflict/mode-csharp";
import "ace-builds/src-min-noconflict/mode-clojure";
import "ace-builds/src-min-noconflict/mode-cobol";
import "ace-builds/src-min-noconflict/mode-lisp";
import "ace-builds/src-min-noconflict/mode-d";
import "ace-builds/src-min-noconflict/mode-elixir";
import "ace-builds/src-min-noconflict/mode-erlang";
import "ace-builds/src-min-noconflict/mode-fsharp";
import "ace-builds/src-min-noconflict/mode-fortran";
import "ace-builds/src-min-noconflict/mode-golang";
import "ace-builds/src-min-noconflict/mode-groovy";
import "ace-builds/src-min-noconflict/mode-haskell";
import "ace-builds/src-min-noconflict/mode-java";
import "ace-builds/src-min-noconflict/mode-javascript";
import "ace-builds/src-min-noconflict/mode-kotlin";
import "ace-builds/src-min-noconflict/mode-lua";
import "ace-builds/src-min-noconflict/mode-objectivec";
import "ace-builds/src-min-noconflict/mode-perl";
import "ace-builds/src-min-noconflict/mode-ocaml";
import "ace-builds/src-min-noconflict/mode-pascal";
import "ace-builds/src-min-noconflict/mode-php";
import "ace-builds/src-min-noconflict/mode-prolog";
import "ace-builds/src-min-noconflict/mode-python";
import "ace-builds/src-min-noconflict/mode-r";
import "ace-builds/src-min-noconflict/mode-ruby";
import "ace-builds/src-min-noconflict/mode-rust";
import "ace-builds/src-min-noconflict/mode-scala";
import "ace-builds/src-min-noconflict/mode-sql";
import "ace-builds/src-min-noconflict/mode-swift";
import "ace-builds/src-min-noconflict/mode-typescript";
import "ace-builds/src-min-noconflict/mode-nim";
// ========================
import "ace-builds/src-min-noconflict/snippets/vbscript";
import "ace-builds/src-min-noconflict/snippets/assembly_x86";
import "ace-builds/src-min-noconflict/snippets/sh";
import "ace-builds/src-min-noconflict/snippets/c_cpp";
import "ace-builds/src-min-noconflict/snippets/clojure";
import "ace-builds/src-min-noconflict/snippets/cobol";
import "ace-builds/src-min-noconflict/snippets/lisp";
import "ace-builds/src-min-noconflict/snippets/d";
import "ace-builds/src-min-noconflict/snippets/elixir";
import "ace-builds/src-min-noconflict/snippets/erlang";
import "ace-builds/src-min-noconflict/snippets/fsharp";
import "ace-builds/src-min-noconflict/snippets/fortran";
import "ace-builds/src-min-noconflict/snippets/golang";
import "ace-builds/src-min-noconflict/snippets/groovy";
import "ace-builds/src-min-noconflict/snippets/haskell";
import "ace-builds/src-min-noconflict/snippets/java";
import "ace-builds/src-min-noconflict/snippets/javascript";
import "ace-builds/src-min-noconflict/snippets/kotlin";
import "ace-builds/src-min-noconflict/snippets/lua";
import "ace-builds/src-min-noconflict/snippets/objectivec";
import "ace-builds/src-min-noconflict/snippets/ocaml";
import "ace-builds/src-min-noconflict/snippets/pascal";
import "ace-builds/src-min-noconflict/snippets/perl";
import "ace-builds/src-min-noconflict/snippets/csharp";
import "ace-builds/src-min-noconflict/snippets/prolog";
import "ace-builds/src-min-noconflict/snippets/python";
import "ace-builds/src-min-noconflict/snippets/r";
import "ace-builds/src-min-noconflict/snippets/ruby";
import "ace-builds/src-min-noconflict/snippets/rust";
import "ace-builds/src-min-noconflict/snippets/scala";
import "ace-builds/src-min-noconflict/snippets/sql";
import "ace-builds/src-min-noconflict/snippets/swift";
import "ace-builds/src-min-noconflict/snippets/typescript";
import "ace-builds/src-min-noconflict/snippets/php";
import "ace-builds/src-min-noconflict/snippets/vbscript";
import "ace-builds/src-min-noconflict/snippets/nim";
// ========================
import "ace-builds/src-min-noconflict/theme-tomorrow_night_eighties";
import "ace-builds/src-min-noconflict/theme-tomorrow_night_bright";
import "ace-builds/src-min-noconflict/theme-tomorrow_night_blue";
import "ace-builds/src-min-noconflict/theme-tomorrow_night";
import "ace-builds/src-min-noconflict/theme-tomorrow";
import "ace-builds/src-min-noconflict/theme-textmate";
import "ace-builds/src-min-noconflict/theme-terminal";
import "ace-builds/src-min-noconflict/theme-sqlserver";
import "ace-builds/src-min-noconflict/theme-solarized_light";
import "ace-builds/src-min-noconflict/theme-solarized_dark";
import "ace-builds/src-min-noconflict/theme-pastel_on_dark";
import "ace-builds/src-min-noconflict/theme-one_dark";
import "ace-builds/src-min-noconflict/theme-nord_dark";
import "ace-builds/src-min-noconflict/theme-monokai";
import "ace-builds/src-min-noconflict/theme-mono_industrial";
import "ace-builds/src-min-noconflict/theme-merbivore_soft";
import "ace-builds/src-min-noconflict/theme-merbivore";
import "ace-builds/src-min-noconflict/theme-kuroir";
import "ace-builds/src-min-noconflict/theme-kr_theme";
import "ace-builds/src-min-noconflict/theme-katzenmilch";
import "ace-builds/src-min-noconflict/theme-iplastic";
import "ace-builds/src-min-noconflict/theme-idle_fingers";
import "ace-builds/src-min-noconflict/theme-gruvbox_light_hard";
import "ace-builds/src-min-noconflict/theme-gruvbox_dark_hard";
import "ace-builds/src-min-noconflict/theme-gruvbox";
import "ace-builds/src-min-noconflict/theme-gob";
import "ace-builds/src-min-noconflict/theme-github_light_default";
import "ace-builds/src-min-noconflict/theme-github_dark";
import "ace-builds/src-min-noconflict/theme-github";
import "ace-builds/src-min-noconflict/theme-eclipse";
import "ace-builds/src-min-noconflict/theme-dreamweaver";
import "ace-builds/src-min-noconflict/theme-dracula";
import "ace-builds/src-min-noconflict/theme-dawn";
import "ace-builds/src-min-noconflict/theme-crimson_editor";
import "ace-builds/src-min-noconflict/theme-cobalt";
import "ace-builds/src-min-noconflict/theme-clouds_midnight";
import "ace-builds/src-min-noconflict/theme-clouds";
import "ace-builds/src-min-noconflict/theme-cloud_editor_dark";
import "ace-builds/src-min-noconflict/theme-cloud_editor";
import "ace-builds/src-min-noconflict/theme-cloud9_night_low_color";
import "ace-builds/src-min-noconflict/theme-cloud9_night";
import "ace-builds/src-min-noconflict/theme-cloud9_day";
import "ace-builds/src-min-noconflict/theme-chrome";
import "ace-builds/src-min-noconflict/theme-chaos";
import "ace-builds/src-min-noconflict/theme-ambiance";

import { getLanguages } from "@/actions/judge/calls";
import { LANGUAGE_CONFIG } from "@/config/languages";
import { type CodeStorage, Settings } from "@/services/settings";
import type { Ace } from "ace-builds";
// ========================

export default function AceEditor() {
  const ctx = useAppContext();

  useEffect(() => {
    getLanguages(ctx);
  }, []);

  useCodeEditor(ctx);


  const onEditorLoad = useCallback(
    (editor: Ace.Editor) => {
      if (!ctx.code) return;
      // @ts-ignore
      ctx.code.current = editor;

      const currentLanguage = LANGUAGE_CONFIG[ctx.languageId];
      editor.session.setMode(`ace/mode/${currentLanguage?.mode}`);
      editor.setTheme(`ace/theme/${ctx.colorTheme}`);

      // Load initial content
      const savedCodes = JSON.parse(
        localStorage.getItem(Settings.CODE_STORAGE) || "{}",
      ) as CodeStorage;
      const savedCode = savedCodes[currentLanguage?.mode] || "";
      const defaultText = currentLanguage?.defaultText || "";
      const initialText = savedCode ? atob(savedCode) : defaultText;

      editor.session.setValue(initialText);
      editor.clearSelection();

      setTimeout(() => {
        editor.renderer.updateFull(true);
      }, 100);
    },
    [ctx.languageId, ctx.colorTheme, ctx.code],
  );


  return (
    <AceEditorComponent
      mode={LANGUAGE_CONFIG[ctx.languageId]?.mode || "python"}
      ref={ctx.code}
      onLoad={onEditorLoad}
      theme={ctx.colorTheme}
      name="ace-editor"
      enableBasicAutocompletion={true}
      enableLiveAutocompletion={true}
      enableSnippets={true}
      setOptions={{
        showLineNumbers: true,
        tabSize: 2,
        enableLiveAutocompletion: true,
        enableSnippets: true,
        enableBasicAutocompletion: true,
      }}
      style={{
        width: "100%",
        height: "100%",
        fontFamily: "CommitMono",
      }}
      editorProps={{ $blockScrolling: true }}
    />
  );
}
