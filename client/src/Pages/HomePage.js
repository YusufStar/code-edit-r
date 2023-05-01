import React from 'react'
import ParticleAnimation from '../Components/ParticleAnim'
import Navbar from '../Components/Navbar'

const HomePage = () => {
  return (
    <>
      <ParticleAnimation />
      <div className='home_body'>
        <Navbar />

        <div className='home_content'>
          <h1 className='home_title'><span>Write Your Code.</span></h1>
          <p className='home_subtitle'>Build your project with the power of the cloud.</p>
          <button className='home_button'><p>Get Started</p></button>
        </div>

      </div>
    </>
  )
}

export default HomePage