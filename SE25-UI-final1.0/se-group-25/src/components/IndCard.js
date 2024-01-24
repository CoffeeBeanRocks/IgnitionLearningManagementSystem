import React, { useState,useContext, useEffect } from 'react';
import ThemeContext from '../context/ThemeContext';
import './styles/indcard.css';
import Info from '../indComponents/Info';
import Announcements from '../indComponents/Announcements';
import Assignments from '../indComponents/Assignments';
import Grades from '../indComponents/Grades';
import People from '../indComponents/People';
import NotFound from './NotFound'
import { useSelector } from 'react-redux';
import Chat from '../indComponents/chat';
import BASE_URL from '../shared/baseURL';
import axios from 'axios';
import { Link, Route, Routes, useNavigate } from 'react-router-dom';


function IndCard({card,assignments, announcements, assignmentSubmissions, setAnnouncements }) {
  const { theme } = useContext(ThemeContext);
  const [sideButton, setSideButton] = useState('Home')
  const sideBarItems = ['Home','Announcements','Assignments','Grades','People', 'Chats']

  // Get Assignment Data on Load
  // Dummy assignments data

  /* const assignmentSubmissions = [
    {
      assignmentId:0,
      user:'johndoe@gmail.com',
      time: new Date(2023,11,1,23,55,0,0),
      link: "https://example-files.online-convert.com/document/txt/example.txt",
      marks: 100,
    },
    {
      assignmentId:1,
      user:'shahsamy@iu.edu',
      time: new Date(2023,11,1,23,55,0,0),
      link: "https://www.africau.edu/images/default/sample.pdf",
      marks: 100,
    },
    {
      assignmentId:1,
      user:'johndoe@gmail.com',
      time: new Date(2023,11,3,22,15,0,0),
      link: "https://bayes.wustl.edu/etj/articles/random.pdf",
      marks: -1,
    },
  ] */
  const user = useSelector(state=>state.loggedInUser)
  let navigate=useNavigate()
  const handleSideClick = (btn) => {
    if(btn === 'home') {
      navigate(`/dashboard/${card.courseCode}`)
    }
    else {
    navigate(btn)
  }
    setSideButton(btn)
  }
  //console.log(assignments[2].dueDate.toLocaleString())
  return (
    <div className="canvas-layout body-container">
      <div className={`canvas-sidebar sidebar-${theme}`}>
        <nav>
          <ul>
            {sideBarItems.map((btn) => {return(<li><button  key={btn} className={`btn-${sideButton===btn.toLowerCase()?"active":""}`} onClick={() => handleSideClick(btn.toLowerCase())}>{btn}</button></li>)})}
          </ul>
        </nav>
        {/* <nav>
          <ul>
            <li><a className={`btn-active`} href= "">Home</a></li>
            {sideBarItems.map((btn) => {return(<li><Link  key={btn} className={`btn-${sideButton===btn?"active":""}`} to= {btn.toLowerCase()}>{btn}</Link></li>)})}
          </ul>
        </nav> */}
      </div>
      <Routes>
        <Route index element={<Info card={card}/>}/>
        <Route path='announcements' element={<Announcements courseName={card?.courseName} announcements={announcements} setAnnouncements={setAnnouncements}/>}/>
        <Route path='assignments/*' element={<Assignments card = {card} loggedInuser={user} ass={assignments} assignmentSubmissions={assignmentSubmissions}/>}/>
        <Route path='grades' element={<Grades user={user} assignments={assignments} assignmentSubmissions={assignmentSubmissions} cardData ={card}/>}/>
        <Route path='people' element={<People card= {card}/>}/>
        <Route path='chats' element={<Chat username={user.email}/>}/>
      </Routes>
      {/* {sideButton === 'Home'? 
        <Info card={card}/>
      :
      sideButton === 'Announcements'?
        <Announcements courseName={card?.courseName} announcements={announcements} setAnnouncements={setAnnouncements}/>
      :
      sideButton === 'Assignments'?
        <Assignments card = {card} loggedInuser={user} ass={assignments} assignmentSubmissions={assignmentSubmissions}/>
      :
      sideButton === 'Grades'?
        <Grades user={user} assignments={assignments} assignmentSubmissions={assignmentSubmissions} cardData ={card}/>
      :
      sideButton === 'People'?
        <People card= {card}/>
      :
      sideButton === 'Chats'?
        <Chat username={user.email}/>
      : <NotFound />} */}
      <div className={`canvas-assignments-${theme}`}>
        <h2>My Assignments</h2>
        {assignments?.filter((assignment) => new Date() < assignment?.dueDate).map((assignment, index) => {
          let userSubmission = assignmentSubmissions?.filter((submission) => submission.assignmentId === assignment.assignmentId && submission.user === user.email)[0]
          if (!userSubmission) {
          return(
            <Link className='card-links' to='assignments'>
            <div key={index} className="assignment-card">
              <h3>{assignment.title}</h3>
              <p>Due Date: {assignment.dueDate.toDateString()}</p>
              <p>Close Date: {assignment.closeDate?.toDateString()}</p>
            </div>
            </Link>
          )}
        })}
      </div>
    </div>
  );
}

export default IndCard;
