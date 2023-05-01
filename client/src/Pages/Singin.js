import React from 'react'
import {useNavigate} from "react-router-dom"

const Singin = () => {
  const navigate = useNavigate()
  const handleLogin = async (e) => {
    e.preventDefault()
    const username = e.target.username.value
    const password = e.target.password.value
    const res = await fetch('http://localhost:3333/auth/signin', {
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
          <h1>Sign Up</h1>
        </div>
          <form onSubmit={handleLogin}>
            <div className='auth_form_body_input'>
              <label htmlFor='username'>Username</label>
              <input type='text' name='username' id='username' />
            </div>
            <div className='auth_form_body_input'>
              <label htmlFor='password'>Password</label>
              <input type='password' name='password' id='password' />
            </div>
            <button type='submit'
              className='auth_form_body_button'
            >Sign In</button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Singin