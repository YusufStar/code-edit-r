import React, { useEffect, useState } from 'react'
import { useLocation, useParams } from 'react-router-dom'
import AceEditor from "react-ace";
import "ace-builds/webpack-resolver";
import "ace-builds/src-noconflict/mode-python";
import "ace-builds/src-noconflict/theme-monokai";
import "ace-builds/src-noconflict/ext-language_tools";
import Navbar from './Navbar'
import { toast } from 'react-hot-toast';

const Editor = () => {
  const location = useLocation()
  const { file, isFile } = location.state
  const { username, filename } = useParams()
  const [code, setCode] = useState(file?.code)
  const user = localStorage.getItem("user")
  const [editedfilename, seteditedfilename] = useState(filename)

  const hamdleUpdateFile = async () => {
    const response = await fetch(`http://localhost:3333/${username}/files/${filename}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ code: code, filename: editedfilename })
    })

    const data = response.json()

    toast.promise(
      Promise.resolve(data),
      {
        loading: "Saving...",
        success: "Successfully Saved!",
        error: "Failed to Save!"
      },
      {
        style: {
          borderRadius: '10px',
          background: '#333',
          color: '#fff',
          padding: '10px',
          margin: '10px'
        }
      }
    )
  }

  return (
    <div className='cst_body'>
      <Navbar />
      <div className='editor'>
        <div className='editor_header'>
          <div className='editor_header_left'>
            <p>My Editor</p>
          </div>
          <div className='editor_header_right'>
            <p>File: <span suppressContentEditableWarning={true} contentEditable onInput={(e) => seteditedfilename(e.currentTarget.textContent)}>{file.filename}</span></p>
            <p>Language: {file.lang}</p>
            <p onClick={hamdleUpdateFile} style={{
              color: "white",
              cursor: "pointer"
            }}>save</p>
          </div>
        </div>
        <div className='editor_body'>
          <AceEditor
            placeholder="Placeholder Text"
            mode="python"
            theme="monokai"
            name="blah2"
            onChange={(e) => setCode(e)}
            fontSize={16}
            showPrintMargin={false}
            showGutter={true}
            highlightActiveLine={true}
            value={code}
            setOptions={{
              enableBasicAutocompletion: false,
              enableLiveAutocompletion: false,
              enableSnippets: true,
              showLineNumbers: true,
            }} style={{
              width: "calc(100% - 24px)",
              marginLeft: "24px",
              height: "100%",
            }} />
        </div>
      </div>
    </div>
  )
}

export default Editor