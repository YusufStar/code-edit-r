import React, { useEffect, useState } from 'react'
import Navbar from '../Components/Navbar'

const Community = () => {
  const [files, setfiles] = useState([])

  const getFiles = async () => {
    await fetch(`https://codeeditor-w8wq.onrender.com/files`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(response => response.json())
      .then(files => {
        console.log(files.data)
        setfiles(files.data)
      })
      .catch(error => console.error(error));
  }

  useEffect(() => {
    document.title = 'Community | CodeEditor'
    getFiles()  
  }, [])
  
  return (
    <div className='community_body'>
        <Navbar/>
        <div className="community_container">
            
        </div>
    </div>
  )
}

export default Community