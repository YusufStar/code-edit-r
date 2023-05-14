import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import Navbar from '../Components/Navbar'
import SyntaxHighlighter from "react-syntax-highlighter"
import { atomOneDark } from "react-syntax-highlighter/dist/esm/styles/hljs"
import { toast } from 'react-hot-toast'

const Post = () => {
  const { id } = useParams()
  const [file, setFile] = useState(null)
  const user = JSON.parse(localStorage.getItem("user"))

  /* get forums and filter id my id */
  const getPost = async () => {
    const response = await fetch(`https://codeeditor-w8wq.onrender.com/forums/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    const data = await response.json()
    const post = data?.filter((dt) => dt._id === id)[0]
    getFile(post, post.fileid)
  }

  const getFile = async (post, fileid) => {
    const response = await fetch(`https://codeeditor-w8wq.onrender.com/${user.username}/files/${fileid}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    const data = await response.json()

    toast.promise(
      Promise.resolve(response),
      {
        loading: "Loading Post...",
        success: () => {
          return "Post Loaded!"
        },
        error: () => {
          return "Failed to Load Post!"
        }
      },
      {
        style: {
          borderRadius: '10px',
          background: '#333',
          color: '#fff',
        }
      }
    )

    setFile({
      ...post,
      ...data
    })
  }

  useEffect(() => {
    if (user) {
      getPost()
    } else {
      window.location.href = "/auth/signup"
    }
  }, [])

  const handleNewComment = async e => {
    e.preventDefault()
    const comment = e.target[0].value
    const username = JSON.parse(localStorage.getItem("user")).username
    const response = await fetch(
      `https://codeeditor-w8wq.onrender.com/forum/${id}/comments`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: comment, username }),
      }
    )

    await response.json().then(() => {
      e.target[0].value = ''
      getPost()
    })

    toast.promise(Promise.resolve(response),
      {
        loading: "Creating Comment...",
        success: () => {
          return "Comment Created!"
        },
        error: () => {
          return "Failed to Create Comment!"
        }
      },
      {
        style: {
          borderRadius: '10px',
          background: '#333',
          color: '#fff',
        }
      }
    )
  }

  return (
    <div className='post_body'>
      <Navbar />
      <div className="post_container">
        <div className="post_header">
          <h1>{file?.title}</h1>
          <p>
            {file?.username} - {new Date(file?.date).toLocaleDateString()}
          </p>
        </div>

        <div className="divider_row" />

        <div className="post_content">
          <p>{file?.description}</p>
          {/* Code Section */}
          <div className="post_code">
            <p>{file?.filename}</p>
            <SyntaxHighlighter
              language={file?.lang.toLowerCase()}
              style={atomOneDark}
              customStyle={{
                width: '100%',
                height: 'auto',
                padding: '25px',
                backgroundColor: '#333333',
                fontSize: '14px',
                lineHeight: '1.5',
                color: '#dcdcdc',
                overflowX: 'hidden',
              }}
              wrapLongLines={true}
              showLineNumbers={true}
            >
              {file?.code}
            </SyntaxHighlighter>
          </div>
          <div className="post_comments_body">
            <form onSubmit={handleNewComment} className="post_comments_form">
              <input
                type="text"
                className='comment_input'
                placeholder='Comment...'
                required
              />
              <button type='Submit'>Send</button>
            </form>
            {file?.comments?.map((comment, index) => (
              <div key={index} className="post_comment">
                <div className="post_comment_header">
                  <h2>{comment.username}</h2>
                  <p>{new Date(file?.date).toLocaleDateString()}</p>
                </div>

                <div className="divider_row"></div>
                
                <p className='message'>{comment.message}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Post