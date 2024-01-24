import React, { useState,useContext } from 'react'
import ThemeContext from '../context/ThemeContext'
import './styles/announcements.css'
import { useSelector } from 'react-redux'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import axios from 'axios'
import BASE_URL from '../shared/baseURL';
import {Modal} from 'react-bootstrap'
import Success from '../components/Success';
import Loading from '../components/Loading';


const Announcements = ({courseName,announcements, setAnnouncements}) => {
  const {theme} = useContext(ThemeContext)
  const loggedInUser = useSelector(state => state.loggedInUser)
  const [showNewPost, setShowNewPost] = useState(false)
  
  const [newAnnouncement, setNewAnnouncement] = useState({
    title:'',
    message: '',
  })

  return (
    <div className={`canvas-content content-${theme}`}>
      <div className={`canvas-header canvas-header-${theme} canvas-assignment-header`}>
        <h1>Announcements</h1>
        {loggedInUser.type === "Instructor" ? 
          <div className='create-assignment'>
            <button className={`create-btn create-btn-${theme}`} onClick={() => setShowNewPost(true)}>Post New Announcement</button>
            <AnnouncemnetPoster showNewPost={showNewPost} setShowNewPost={setShowNewPost} newAnnouncement={newAnnouncement} setNewAnnouncement={setNewAnnouncement} user={loggedInUser} courseName={courseName} />
          </div>
        :<></>
        }
      </div>
      <div className="post-container">
        <PostAnnouncement courseName={courseName} announcements={announcements} setAnnouncements={setAnnouncements} user={loggedInUser}/>
      </div>
    </div>
  )
}


function PostAnnouncement({courseName,announcements, setAnnouncements, user}) {
  const {theme} = useContext(ThemeContext)
  const [showAnnouncement,setShowAnnouncement] = useState(false)
  const [announcementDetails, setAnnouncementDetails] = useState()

  const handleShowAnnouncement=(announcement)=>{
    setAnnouncementDetails(announcement)
    setShowAnnouncement(true)
  }
  return(
    <div className={`canvas-post-wrapper-${theme}`}>
      <div className={`canvas-announcements announcements-${theme}`}>
        {user.type === 'Student' || user.type === "Instructor" ? 
        announcements && announcements.toReversed().map((announcement)=>{
          let monthToIndex = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
          let date = new Date(announcement.datePosted)
          let dateString = String(date.getDate())+' '+ monthToIndex[date.getMonth()]+' '+String(date.getFullYear())
          let timeString = '('+date.toLocaleTimeString(['en-US'],{hour: '2-digit', minute:'2-digit'})+')'
          return(
            <div onClick={()=>handleShowAnnouncement(announcement)} className={`announcement-wrapper subcard-${theme}`}>
              <div className="announcement-header submit-user-info">
                <div className='announcement-person'>
                  <div className='announcement-name'>{announcement.name}</div>
                  <div className='announcement-email'>{announcement.email}</div>
                </div>
                <div className='announcement-time'>
                  {dateString+' '+timeString}
                </div>
              </div>
              <div className="announcement-message assignment-grades">
                {announcement.title?announcement.title:<>"Nothing"</>}
              </div>
            </div>
          );
        })
        :
        <>Unapproved</>
        }
      </div>
      <Modal show = {showAnnouncement} onHide={() => setShowAnnouncement(false)} id={`modal-${theme}`} size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered>
        <Modal.Header closeButton>
          <Modal.Title>Announcement</Modal.Title>
        </Modal.Header>
          <Modal.Body>
            <div className='announcement-details'>
              <div className="announcement-header">
                <div>{announcementDetails?.name}</div>
                <div>{announcementDetails?.email}</div>
              </div>
              <div>{announcementDetails?.message}</div>
            </div>
          </Modal.Body>
      </Modal>
    </div>
  );
}



function AnnouncemnetPoster ({showNewPost,setShowNewPost,newAnnouncement,setNewAnnouncement,user,courseName}) {
  const {theme} = useContext(ThemeContext)
  const [success,setSuccess] = useState(null)
  const [isLoading,setLoading] = useState(false)
  
  const handleClick = async() => {
    setLoading(true)
    await axios.post(`${BASE_URL}/announcements`, {
      courseName: courseName, 
      title: newAnnouncement.title,
      message: newAnnouncement.message,
      email:user.email,
      name: user.fname + " "+ user.lname,
      date: new Date()
    }).then((response) => {
      console.log(response);
      setLoading(false)
      setSuccess(true)
  },(error) => {
    console.log(error)
    setLoading(false)
    setSuccess(false)
  });


  setTimeout(()=> {
    setShowNewPost(false)
    setSuccess(null)
  },5000)
  }

  return(
    <div>
      <Modal show = {showNewPost} onHide={() => setShowNewPost(false)} id={`modal-${theme}`} size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered>
        <Modal.Header closeButton>
          <Modal.Title>Announcement</Modal.Title>
        </Modal.Header>
          <Modal.Body className='modal-form'>
            {isLoading ? 
            <Loading />
            :
            success === null ? 
            <div>
              <div className='input-div'>
                <label>Email</label>
                <input disabled value={user.email}/>
              </div>
              <div className='input-div'>
                <label>Name</label>
                <input disabled value={user.fname+" "+user.lname}/>
              </div>
              <div className='input-div'>
                <label>Title</label>
                <input value={newAnnouncement.title} onChange={(e)=>setNewAnnouncement({...newAnnouncement,title: e.target.value})}/>
              </div>
              <div className='input-div'>
                <label>Message</label>
                <textarea value={newAnnouncement.message} onChange={(e)=>setNewAnnouncement({...newAnnouncement,message: e.target.value})}/>
              </div>
            </div>
            :
            <Success success={success}/>
            }
          </Modal.Body>
          <Modal.Footer>
            <div>
              <button className='btn-red' onClick={()=>handleClick()}>Submit</button>
            </div>
          </Modal.Footer>
      </Modal>
    </div>
  );
}
export default Announcements