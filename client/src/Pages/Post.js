import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import Navbar from '../Components/Navbar'

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

  return (
    <div className='post_body'>
      <Navbar />
      <div className="post_container">
        {JSON.stringify(file)}
      </div>
    </div>
  )
}

export default Post