import React from 'react'
import NotificationsActiveRoundedIcon from '@mui/icons-material/NotificationsActiveRounded';
import FiberManualRecordRoundedIcon from '@mui/icons-material/FiberManualRecordRounded';
import { Link } from 'react-router-dom';

function NotifBox({notif}) {
    const posted_date = new Date(notif.datePosted)
    posted_date.setHours(posted_date.getHours() + 24)
  return (
    <div>
        <div className='notif-box'>
            <Link to={`/dashboard/${notif.courseCode}/announcements`}>
                <div className="notif-header">
                    <div className="notif-icon">
                        <NotificationsActiveRoundedIcon />
                    </div>
                    <div className="notif-subject">{notif.courseName} { posted_date > new Date() ?  <FiberManualRecordRoundedIcon style={{ color: "green", scale: "50%" }} /> : <></>} </div>    
                </div>
                {notif ? 
                <div className="notif-message">
                    {notif.title}
                </div>
                :
                <>No New Notifications</>
                }
            </Link>
        </div>
    </div>
  )
}

export default NotifBox