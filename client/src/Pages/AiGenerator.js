import React, { useEffect, useRef, useState } from 'react'
import Navbar from '../Components/Navbar'
import { atomOneDark } from "react-syntax-highlighter/dist/esm/styles/hljs"
import SyntaxHighlighter from "react-syntax-highlighter"
import { toast } from "react-hot-toast"
import { useNavigate } from 'react-router-dom'

const AiGenerator = () => {
  const [text, setText] = useState("")
  const [data, setData] = useState()
  const [copy, setCopy] = useState(false)
  const [lang, setLang] = useState("python")
  const [optionsOpen, setOptionsOpen] = useState(false);
  const optionsWrapperRef = useRef(null);
  const [file, setFile] = useState({
    filename: data?.name,
    code: data?.code,
    lang: data?.lang
  })
  const [loading, setLoading] = useState()
  const user = JSON.parse(localStorage.getItem("user"))
  const navigate = useNavigate()

  const options = [
    { value: "python", label: "Python" },
    { value: "javascript", label: "Javascript" },
  ];

  const handleSelectClick = () => {
    setOptionsOpen(!optionsOpen);
  };

  const handleOptionClick = (optionValue) => {
    setLang(optionValue);
    setOptionsOpen(false);
  };

  const selectedOption = options.find(
    (option) => option.value === lang
  );

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        optionsWrapperRef.current &&
        !optionsWrapperRef.current.contains(event.target)
      ) {
        setOptionsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      setLoading(true)
      const response = await fetch(`https://codeeditor-w8wq.onrender.com/create-code`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ text: text, lang: lang })
      });
      const hamData = await response.json();
      const data = JSON.parse(hamData)
      if (data.success) {
        toast.success(
          "Successfully Generated Code!",
          {
            style: {
              borderRadius: '10px',
              background: '#333',
              color: '#fff',
            }
          }
        )
      } else {
        toast.error(data.error)
      }
      setFile({
        filename: data?.name,
        code: data?.code,
        lang: data?.lang
      })
      setData(data);
      setCopy(true);
      setText("");
    } catch (error) {
      console.error(error);
      setCopy(false)
    } finally {
      setLoading(false);
    }
  };

  const handleNewFile = async () => {
    if (!user) {
      navigate("/auth/signin")
    } else {
      const response = await fetch(`https://codeeditor-w8wq.onrender.com/${user?.username}/files`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(file)
      })

      const data = await response.json()

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
  }

  return (
    <div className='ai_body'>
      <Navbar />
      <div className='ai_content'>
        <form onSubmit={handleSubmit} className="ai_input_body">
          <div className="ai_input_inputs">
            <div className="select-wrapper" ref={optionsWrapperRef}>
              <div
                className="select-inner-wrapper"
                onClick={handleSelectClick}
                data-testid="select-inner-wrapper"
              >
                <div className="selected-value">{selectedOption.label}</div>
                <ion-icon name="chevron-down-outline"></ion-icon>
              </div>
              {optionsOpen && (
                <div className="options-wrapper">
                  {options.map((option) => (
                    <div
                      key={option.value}
                      className={`option ${option.value === lang ? "active" : ""
                        }`}
                      onClick={() => handleOptionClick(option.value)}
                      data-testid={`option-${option.value}`}
                    >
                      {option.label}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <input
              required
              className='ai_input_message'
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Text To Code..."
            />
          </div>
          <button type='submit' className='ai_input_button'>
            <svg className='send_svg' fill="##ffff" width="800px" height="800px" viewBox="0 0 24 24" id="send" xmlns="http://www.w3.org/2000/svg">
              <line id="secondary" x1="7" y1="12" x2="11" y2="12"></line>
              <path id="primary" d="M5.44,4.15l14.65,7a1,1,0,0,1,0,1.8l-14.65,7A1,1,0,0,1,4.1,18.54l2.72-6.13a1.06,1.06,0,0,0,0-.82L4.1,5.46A1,1,0,0,1,5.44,4.15Z"></path>
            </svg>
          </button>
        </form>

        <div className="ai_res_detail">
          <p className='ai_res_detail_header'>
            {data?.name || "No data found"}
          </p>
          <div className='ai_code_action_buttons'>
          <button className='aciton_button'
            disabled={!data}
            style={{
              opacity: data ? 1 : 0.5,
              cursor: data ? "pointer" : "not-allowed",
            }}
            onClick={() => handleNewFile()}
          >
            <ion-icon name="save-outline" className="copy_icon" size="midium" />
            <span>Save Code</span>
          </button>
          <button className='aciton_button'
            disabled={!copy}
            style={{
              opacity: copy ? 1 : 0.5,
              cursor: copy ? "pointer" : "not-allowed",
            }}
            onClick={() => {
              if (data?.code) {
                navigator.clipboard.writeText(data.code)
                toast.success("Successfully Copied Code!", {
                  style: {
                    borderRadius: '10px',
                    background: '#333',
                    color: '#fff',
                  }
                })
              }
            }}
          >
            <ion-icon name="clipboard-outline" className="copy_icon" size="midium" />
            <span>Copy Code</span>
          </button>
          </div>
        </div>
        {loading ? (
          <div className='loading_container'>
            <div className='loading'></div>
            <p className='loading_text'>loading
              <span class="dot">.</span>
              <span class="dot">.</span>
              <span class="dot">.</span>
            </p>
          </div>
        ) : (
          <div className='ai_res_div' style={{ position: 'relative' }}>
            <SyntaxHighlighter
              language='python'
              style={atomOneDark}
              customStyle={{
                width: '750px',
                height: '500px',
                padding: '25px',
                backgroundColor: '#333333',
                fontSize: '14px',
                lineHeight: '1.5',
                color: '#dcdcdc',
                overflowX: 'auto',
              }}
              wrapLongLines={true}
              showLineNumbers={true}
            >
              {data?.code}
            </SyntaxHighlighter>
          </div>

        )}
      </div>
    </div>
  )
}

export default AiGenerator