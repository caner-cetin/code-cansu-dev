import React from 'react'
import AceEditor from 'react-ace'

export interface CodeEditorProps {
  code: React.MutableRefObject<AceEditor | null>
}
export const CodeEditor: React.FC<CodeEditorProps> = ({code}) => {
  return (
    <AceEditor
      mode="python"
      ref={code}
      theme="tomorrow_night_eighties"
      name="ace-editor"
      enableBasicAutocompletion={true}
      enableLiveAutocompletion={true}
      enableSnippets={true}
      setOptions={{
        showLineNumbers: true,
        tabSize: 2,
      }}
      style={{ width: '100%', height: '100%', fontFamily: 'CommitMono' }}
    />
  )
}