import React, { useState } from 'react'
import { toast } from 'react-hot-toast'
import { useNavigate } from "react-router-dom"
import Navbar from '../Components/Navbar'

const Signup = () => {
  const navigate = useNavigate()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const handleRegister = async (e) => {
    e.preventDefault()
    if (password.length < 6) {
      // Display error message
      return toast.error('Password less than 6 characters');
    }

    try {
  const response = await fetch(`https://codeeditor-w8wq.onrender.com/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
      });
      const data = await response.json();

      if (response.ok) {
        // Display success message
        toast.success(data.message);
        navigate("/auth/signin")
      } else {
        // Display error message
        toast.error(data.message);
      }
    } catch (error) {
      // Display error message
      toast.error('An error occurred');
    }
  }

  return (
    <div className='auth_body'>
      <Navbar />
      <div className='auth_form'>
        <div className='auth_form_body'>
          <div className='auth_form_header'>
            <h1>Sign Up</h1>
          </div>
          <form onSubmit={handleRegister}>
            <div
              className='auth_form_body_input'>
              <label htmlFor='username'>Username</label>
              {/* if user name border color style red and green */}
              <input
                style={{
                  backgroundColor: "#1c1c1c"
                }}
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                type='text' name='username' id='username' />
            </div>
            <div className='auth_form_body_input'>
              <label htmlFor='password'>Password</label>
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  backgroundColor: "#1c1c1c"
                }}
                required type='password' name='password' id='password' />
            </div>

            <div className='auth_form_body_input'>
              <label htmlFor='confirmPassword'>Confirm Password</label>
              <input
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                style={{
                  backgroundColor: "#1c1c1c"
                }}
                required type='password' name='confirmPassword' id='confirmPassword' />
            </div>

            <button
            disabled={!username || !password || !confirmPassword || password !== confirmPassword}
              type='submit'
              className='auth_form_body_button'
            >Sign Up</button>

            <p className='auth_form_body_text'>
              Already have an account? <a href='/auth/signin'>Sign In</a>
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Signup