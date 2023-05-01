import React from 'react'
import { toast } from 'react-hot-toast'
import {useNavigate} from "react-router-dom"

const Signup = () => {
  const navigate = useNavigate()
  const handleRegister = async (e) => {
    e.preventDefault()
    const username = e.target.username.value
    const password = e.target.password.value
    const confirmPassword = e.target.confirmPassword.value
    if (password !== confirmPassword) {
      alert('Passwords do not match')
      return
    }
    const response = await fetch('http://localhost:3333/auth/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, password })
    })
    toast.success("Account created successfully! You can now login.",)
    navigate("/auth/signin")
  }
  return (
    <div className='auth_body'>
      <div className='auth_form'>
        <div className='auth_form_body'>
        <div className='auth_form_header'>
          <h1>Sign Up</h1>
        </div>
          <form onSubmit={handleRegister}>
            <div className='auth_form_body_input'>
              <label htmlFor='username'>Username</label>
              <input type='text' name='username' id='username' />
            </div>
            <div className='auth_form_body_input'>
              <label htmlFor='password'>Password</label>
              <input type='password' name='password' id='password' />
            </div>

            <div className='auth_form_body_input'>
              <label htmlFor='confirmPassword'>Confirm Password</label>
              <input type='password' name='confirmPassword' id='confirmPassword' />
            </div>

            <button type='submit'
              className='auth_form_body_button'
            >Sign Up</button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Signup