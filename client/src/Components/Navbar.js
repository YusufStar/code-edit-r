import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const Navbar = () => {
    const [user, setUser] = useState()
    const navigate = useNavigate()

    useEffect(() => {
        setUser(JSON.parse(localStorage.getItem("user")))
    }, [])
    

    return (
        <div className='navbar'>
            <div className='navbar_left'>
                <div className='navbar_left_logo'>
                    <p onClick={() => navigate("/")}>LOGO</p>
                </div>
                <div className='navbar_left_links'>
                    <p onClick={() => navigate("/ai")}>AI Generator</p>
                </div>
                <div className='navbar_left_links'>
                    <p onClick={() => navigate("/files")}>Files</p>
                </div>
            </div>

            <div className='navbar_right'>
                {user ?
                    (
                        <div className='navbar_user'>
                            <p>{user.username}</p>
                        </div>
                    ) : (
                        <div className='navbar_auth'>
                            <button
                                onClick={() => navigate("/auth/signup")}
                                className='signup'><p>Sign Up</p></button>
                            <button className='login'
                                onClick={() => navigate("/auth/signin")}
                            ><p>Log In</p></button>
                        </div>
                    )}
            </div>
        </div>
    )
}

export default Navbar