import type AceEditor from "react-ace";
import React from "react";
import { createContext, useContext, useRef } from "react";

export type EditorContextType = {
  editorRef: React.MutableRefObject<AceEditor | null>;
};

export const EditorContext = createContext<EditorContextType | null>(null);

export const EditorProvider: React.FC<{ children: React.ReactNode }> = ({
  children
}) => {
  const editorRef = useRef<AceEditor | null>(null);

  return (
    <EditorContext.Provider value={{ editorRef }}>
      {children}
    </EditorContext.Provider>
  );
};

export const useEditorRef = () => {
  const context = useContext(EditorContext);
  if (!context) {
    throw new Error('useEditor must be used within an EditorProvider');
  }
  return context.editorRef;
};