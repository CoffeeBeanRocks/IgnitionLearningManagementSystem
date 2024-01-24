import React, { useContext } from 'react'
import './styles/sections.css'
import ThemeContext from '../context/ThemeContext'

const Info = ({card}) => {
  const {theme} = useContext(ThemeContext)
  return (
    <div className={`canvas-content content-${theme}`}>
        <div className={`canvas-header canvas-header-${theme}`}>
            <h1>{card?.courseName}</h1>
            <p>Subject ID: {card?.courseCode}</p>
            <p>Grade: {card?.letterGrade}</p>
        </div>
        <div className={`canvas-description canvas-description-${theme}`}>
            <p>
            {card?.description? card.description:<></>}
            </p>
        </div>
    </div>
  )
}

export default Info