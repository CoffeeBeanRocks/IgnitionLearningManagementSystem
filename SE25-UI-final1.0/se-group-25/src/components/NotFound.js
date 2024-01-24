import React, { useContext } from 'react'
import ThemeContext from '../context/ThemeContext'

const NotFound = () => {
  const {theme} = useContext(ThemeContext)
  return (
    <div className={`not-found-div center-div-${theme}`}>
        <div>404 Error! Not Found</div>
    </div>
  )
}

export default NotFound