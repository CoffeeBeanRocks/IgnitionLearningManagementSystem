import React, { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import ThemeContext from '../context/ThemeContext'

const Unapproved = ({setLoggedInUser}) => {
    const navigate = useNavigate()
    const logout = () => {
        localStorage.removeItem('jsonwebtoken')
        localStorage.removeItem('theme')
        navigate('/login')
        setLoggedInUser()
    }
    const {theme} = useContext(ThemeContext)
  return (
    <div className={`unapproved-div center-div-${theme}`}>
        <div>Your account is not yet approved. Wait for approval and log back in!</div>
        <button className={theme==='light'?'btn-black':'btn-white'} onClick={logout}>Logout</button>
    </div>
  )
}

export default Unapproved