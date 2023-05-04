import React, { useState } from 'react'
import {useNavigate} from "react-router-dom"

const Singin = () => {
  const navigate = useNavigate()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const handleLogin = async (e) => {
    e.preventDefault()
    const res = await fetch('https://codeeditor-w8wq.onrender.com/auth/signin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({username, password})
    })
    const data = await res.json()
      localStorage.setItem('user', JSON.stringify(data.user))
      navigate('/')
  }
  return (
    <div className='auth_body'>
      <div className='auth_form'>
        <div className='auth_form_body'>
        <div className='auth_form_header'>
          <h1>Sign In</h1>
        </div>
          <form onSubmit={handleLogin}>
            <div className='auth_form_body_input'>
              <label htmlFor='username'>Username</label>
              <input
              value={username}
              style={{
                backgroundColor: "#1c1c1c"
              }}
                onChange={(e) => setUsername(e.target.value)}
              type='text' name='username' id='username' />
            </div>
            <div className='auth_form_body_input'>
              <label htmlFor='password'>Password</label>
              <input
              value={password}
              style={{
                backgroundColor: "#1c1c1c"
              }}
                onChange={(e) => setPassword(e.target.value)}
              type='password' name='password' id='password' />
            </div>
            <button
            disabled={!username || !password}
            type='submit'
              className='auth_form_body_button'
            >Sign In</button>

            <p className='auth_form_body_text'>
              Don't have an account? <a href='/auth/signup'>Sign Up</a>
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Singin