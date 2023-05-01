import React from 'react'
import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-jsx";
import "ace-builds/src-noconflict/theme-monokai"
import "ace-builds/src-min-noconflict/ext-searchbox";
import "ace-builds/src-min-noconflict/ext-language_tools";
const languages = [
  "javascript",
  "python",
  "markdown",
  "json",
  "html",
  "css"
];

const editor = ({ language }) => {
  return (
    <AceEditor
      placeholder="Placeholder Text"
      mode="python"
      theme="monokai"
      name="blah2"
      fontSize={14}
      showPrintMargin={true}
      showGutter={true}
      highlightActiveLine={true}
      value={``}
      setOptions={{
        enableBasicAutocompletion: true,
        enableLiveAutocompletion: true,
        enableSnippets: true,
        showLineNumbers: true,
        tabSize: 2,
      }} />

  )
}

export default editor