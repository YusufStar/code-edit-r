import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const Navbar = () => {
    const [user, setUser] = useState()
    const navigate = useNavigate()

    return (
        <div className='navbar'>
            <div className='navbar_left'>
                <div className='navbar_left_logo'>
                    <p onClick={() => navigate("/")}>LOGO</p>
                </div>
                <div className='navbar_left_links'>
                    <p onClick={() => navigate("/ai")}>AI Generator</p>
                </div>
            </div>

            <div className='navbar_right'>
                {user ?
                (
                    <div className='navbar_user'>
                        <img src={user?.profilePhoto} alt={user?.username} />
                        <p>{user.username}</p>
                    </div>
                ) : (
                    <div className='navbar_auth'>
                        <button className='signup'><p>Sign Up</p></button>
                        <button className='login'><p>Log In</p></button>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Navbar