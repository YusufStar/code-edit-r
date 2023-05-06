import React, { useEffect, useState } from 'react'
import { useLocation, useParams } from 'react-router-dom'
import AceEditor from "react-ace";
import "ace-builds/webpack-resolver";
import "ace-builds/src-noconflict/mode-python";
import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/theme-monokai";
import "ace-builds/src-noconflict/ext-language_tools";
import Navbar from '../Components/Navbar'
import { toast } from 'react-hot-toast';
import { atomOneDark } from "react-syntax-highlighter/dist/esm/styles/hljs"
import SyntaxHighlighter from "react-syntax-highlighter"

const Editor = () => {
  const { username, id } = useParams()
  const [file, setFile] = useState()
  const [filename, setFilename] = useState("")
  const [code, setCode] = useState("")
  const [consoleRes, setConsoleRes] = useState("")
  const user = JSON.parse(localStorage.getItem("user"))
  const [isPublic, setIsPublic] = useState(false)
  const [loading, setloading] = useState(false)

  const getFile = async () => {
    const response = await fetch(`https://codeeditor-w8wq.onrender.com/${username}/files/${id}`)
    const data = await response.json()
    console.log(data)
    setFile(data)
    setCode(data.code)
    setFilename(data.filename)
    setIsPublic(data.Ispublic)
  }

  useEffect(() => {
    if (user) {
      getFile()
    } else {
      window.location.href = "/auth/signin"
    }
  }, [])

  const handleSwitchChange = () => {
    setIsPublic(!isPublic)
  };

  const handleAutoComplate = async () => {
    const response = await fetch(`https://codeeditor-w8wq.onrender.com/auto-complete`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ text: code })
    })

    const data = await response.json()

    toast.promise(
      Promise.resolve(response),
      {
        loading: "Auto Completing...",
        success: "Successfully Auto Completed!",
        error: "Failed to Auto Complete!"
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

    setCode(data.res)
  }

  const ExecuteCode = async () => {
    const response = await fetch(`https://codeeditor-w8wq.onrender.com/execute`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ code, lang: file.lang.toLowerCase() })
    })

    const data = await response.json()

    setConsoleRes(data.result)

    toast.promise(
      Promise.resolve(data),
      {
        loading: "Executing...",
        success: "Successfully Executed!",
        error: "Failed to Execute!"
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

  const hamdleUpdateFile = async () => {
    const response = await fetch(`https://codeeditor-w8wq.onrender.com/${username}/files/${filename}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ code: code, username: JSON.parse(localStorage.getItem("user"))?.username, Ispublic: isPublic })
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
    ).then(() => {
      getFile()
    })
  }

  return (
    <div className='editor_body'>
      <Navbar />
      <div className='editor'>
        <div className='editor_header'>
          <div className='editor_header_left'>
            <p>{file?.lang?.charAt(0).toUpperCase() + file?.lang?.slice(1)} Editor</p>
          </div>
          <div className='editor_header_right'>
            <p>File: <span>{file?.filename}</span></p>
            <p>Language: {file?.lang}</p>
            <div className="divider_column"
              style={{
                height: "25px",
                width: "1px",
                backgroundColor: "white",
                margin: "0px 5px",
              }}
            ></div>
            <div className="switch_container">
              <p>{isPublic ? "Public" : "Private"}</p>
              <label className="switch">
                <input type="checkbox" checked={isPublic} onChange={handleSwitchChange} />
                <span className="slider round"></span>
              </label>
            </div>
            <p
              onClick={handleAutoComplate}
              style={{
                olor: "white",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}>
              <ion-icon name="flash-outline"></ion-icon>
            </p>
            <p onClick={() => {
              const promise = navigator.clipboard.writeText(window.location.href)
              toast.promise(
                promise,
                {
                  loading: "Copying...",
                  success: "Successfully Copied!",
                  error: "Failed to Copy!"
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
            } style={{
              olor: "white",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}>
              <ion-icon name="share-outline"></ion-icon>
            </p>
            <p onClick={hamdleUpdateFile} style={{
              olor: "white",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}>
              <ion-icon name="save-outline"></ion-icon>
            </p>
            <p style={{
              color: "white",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
              onClick={() => ExecuteCode()}
            ><ion-icon name="play-outline"></ion-icon>
            </p>
          </div>
        </div>
        <div className='editors_body'>
          <AceEditor
            placeholder="Placeholder Text"
            mode={file?.lang.toLowerCase()}
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
              width: "100%",
              height: "100%",
            }} />

          <SyntaxHighlighter language='powershell' style={atomOneDark} customStyle={{
            width: "100%",
            height: "100%",
            padding: "10px"
          }}
            wrapLongLines={true}>
            {`${consoleRes}`}
          </SyntaxHighlighter>
        </div>
      </div>
    </div>
  )
}

export default Editor