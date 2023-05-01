import React from 'react'
import ParticleAnimation from '../Components/ParticleAnim'
import Navbar from '../Components/Navbar'
import { useNavigate } from 'react-router-dom'

const HomePage = () => {
  const navigate = useNavigate()
  return (
    <>
      <ParticleAnimation />
      <div className='cst_body'>
        <Navbar />
        <div className='home_content'>
          <h1 className='home_title'><span>Write Your Code.</span></h1>
          <p className='home_subtitle'>Build your project with the power of the cloud.</p>
          <button onClick={() => {
            if (!JSON.parse(localStorage.getItem("user"))) {
              navigate("/auth/signup")
            } else {
              navigate("/ai")
            }
          }} className='home_button'><p>{localStorage.getItem("user") ? "Try AI" : "Get Started"}</p></button>
        </div>
      </div>
    </>
  )
}

export default HomePage