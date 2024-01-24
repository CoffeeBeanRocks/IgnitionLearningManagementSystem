import React, { useState,useEffect,useContext} from 'react'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import './styles/calendar.css'
import './styles/dashboard.css'
import ThemeContext from '../context/ThemeContext'
import { Link, useNavigate } from 'react-router-dom'
import { Calendar, dateFnsLocalizer } from 'react-big-calendar'
import format from 'date-fns/format'
import parse from 'date-fns/parse'
import startOfWeek from 'date-fns/startOfWeek'
import getDay from 'date-fns/getDay'
import NotifBox from '../components/NotifBox'
import Axios from 'axios'
import BASE_URL from '../shared/baseURL';


//events - dictionary={id,title,due_date}

//events.push({id,title,due_date})
//  events.push({
//   id:i,
//   title: "Applied Algorithms CSCI-B 505",
//   start: new Date(duedate(year),duedate(momnth),duedate(day),22,30,0,0),
//   end: new Date(duedate(year),duedate(momnth),duedate(day),23,59,59,59),
// },


function Dashboard({announcements,user,graduateDegreeData,setCourseData}) {
    let navigate = useNavigate()
    const [data, setData] = useState([]);
    let events=[]
    const email=user.email
    useEffect(()=>{
      const fetchAssignments= async ()=>{
        const response=await Axios.get(`${BASE_URL}/api/user/enrolledCoursesAssignments/${email}`,{
        });
        setData(response.data.assignments)
      };
      fetchAssignments();
    },[]);
    if (data) {
      for (const d of data){    
        const year = new Date(d.dueDate).getFullYear()
        const month = new Date(d.dueDate).getMonth()
        const day = new Date(d.dueDate).getDate()
        for (const card of graduateDegreeData) {
          if (card.courseID === d.courseID) {
            events.push({
              courseCode: card.courseCode,
              id:d._id,
              title:d.title,
              start:new Date(year,month,day,22,30,0,0),
              end:new Date(year,month,day,23,59,59,59)
          })
        }}
        }
    }


    
const [originalCourses, setOriginalCourses] = useState([])

useEffect(() => {
  const elem = document.getElementById("mainList")
  let childs = Array(document.getElementById("mainList").children)
  // let childs = []
  // for(let i = 0; i < )
  setOriginalCourses(childs[0])
}, [])

function checkUrl ()
{
  const curUrl = window.location.pathname
  if(curUrl === "/")
  {
    return false
  }
  return true
}
function removeAllChildNodes(parent) {
  while (parent.firstChild) {
      parent.removeChild(parent.firstChild);
  }
}
// Original Author: Pranav Mandke
function handleClick(val)
{
  const elem = document.getElementById("mainList")
  // const newElem = document.createElement("div")
  let childs = []
  // childs = originalCourses.filter((elem)=>{
  //   return (elem.outerHTML).toLowerCase().includes(val.toLowerCase());

  // })
  for(let i = 0; i < originalCourses.length; i++)
  {
    if((originalCourses[i].outerHTML).toLowerCase().includes(val.toLowerCase()))
    {
      originalCourses[i].style.display = ""
      childs.push(originalCourses[i])
    }
    else
    {
      originalCourses[i].style.display = "none"
      childs.push(originalCourses[i])
    }
  }
  removeAllChildNodes(document.getElementById("mainList"))
  childs.map((elem)=>{
    document.getElementById("mainList").appendChild(elem)
    return true
  })
  
}

  const locales = {
    "en-US": require("date-fns/locale/en-US")
  }

  const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek,
    getDay,
    locales
  })
  const handleKeyPress =(e) => {
    navigate(`/dashboard/${e.courseCode}/assignments`)
  }
  const {theme} = useContext(ThemeContext)
  return (
    <>
    {checkUrl()==true
      ?
      <>
    <div className={`dashboard-${theme} body-container`}>
      <div className={`dashboard-calendar-${theme}`}>
        <Calendar
          className={`calendar-${theme}`}
          localizer={localizer}
          events={events?events:[]}
          style={{width: 900, height: 600}}
          onSelectEvent={(e) => handleKeyPress(e)}
            />
      </div>

      {user ? 
      <div className={`search-button-${theme}`}>
        <input placeholder='Search' onChange={(e)=>handleClick(e.target.value)}/>
      </div> : 
      <div className='empty-div'></div>}
      {/* Search bar
      <div className='search-container'>
        <input
          type='text'
          placeholder='Search for a subject...'
          value={searchTerm}
          onChange={handleSearch}
          className='search-bar'
        />
        <div className='search-results'>
          {searchResults.map((subject) => (
            <div className='search-item' onClick={() => handleResultClick(subject)}>
              {subject.courseName} ({subject.courseCode})
            </div>
          ))}
        </div>
      </div> */}
      <div className='dashboard-notif-sub'>
        <div className='notif-wrapper'>
          <div className={`notif-title-${theme}`}>Notifications</div>
          <div className='notif-bounding-box'>{announcements?.map((ann) => {
            return (
          <div><NotifBox notif={ann}/></div>
          )})}</div>
        </div>
        <div className='subject-cards' id="mainList">
          {graduateDegreeData.map((subject,idx)=> {
            return(
              <div className={`card-link-${theme}`} id = {"mainListitem"+idx}>
                <Link className='subject-card-link' to={subject.courseCode}>
                  <RenderSubjectCard subject={subject} theme={theme}/>
                </Link>
              </div>);
          })}
        </div>
      </div>
    </div></>
    : <></>}
    </>
  )
}

function RenderSubjectCard({subject,theme}) {
  return(
    <div className='subject-card-container' id={subject.courseCode}>
      <div className={`subject-card-wrapper card-${theme}`}>
        <div className={`subject-card-header card-header-${theme}`}>
          <div className='subject-name'>{subject.courseName} ({subject.courseCode})</div>
          <div className='subject-semester'>{subject.semester}</div>
        </div>
        <div className='subject-details'>
          <div className='subject-professor'>{subject.professorName}</div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard