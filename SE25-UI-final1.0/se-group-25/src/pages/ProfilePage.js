import React from 'react'
import './styles/profile.css'

const ProfilePage = ({user}) => {
  return (
    <div className='profile-container'>
      <div className="header-image-wrapper">
        <img className='header-image' src='https://www.freewebheaders.com/light-blurry-size-1600x400/light-colorful-abstract-blurred-banner_gc-banner-1600x400_246548.JPG'/>
      </div>
      <div className="profile-picture-wrapper">
        <img className='profile-picture' src='https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'/>
      </div>
      <div className="profile-wrapper">
        <div className="profile-name">{user.fname+" "+user.lname}</div>
      </div>
    </div>
  )
}

export default ProfilePage