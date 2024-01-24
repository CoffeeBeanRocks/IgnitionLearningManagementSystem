import React,{useState, useContext, useEffect} from 'react'
import LoginPage from '../pages/LoginPage'
import {Routes, Route, Navigate, useParams, Outlet } from 'react-router-dom'
import Dashboard from '../pages/Dashboard'
import PrivateRoute from '../routeController/PrivateRoute'
import { useDispatch, useSelector } from 'react-redux'
import ThemeContext from '../context/ThemeContext'
import LandingPage from '../pages/LandingPage'
import IndCard from './IndCard'
import Navbar from './Navbar'
import AdminDashboard from './AdminDashboard'
import AdminRoute from '../routeController/AdminRoute'
import axios from 'axios';
import BASE_URL from '../shared/baseURL';
import NotFound from './NotFound'
import Enroll from '../pages/Enroll'

function Main() {
const {theme, setTheme} =useContext(ThemeContext)
const pastTheme = localStorage.getItem('theme')
document.body.style.backgroundColor = theme === 'light' ? "#fff" : "#000";
document.body.style.transition = "all 300ms ease";
const users = useSelector(state => state.users)
const dispatch = useDispatch()
const [loggedInUser, setLoggedInUser] = useState()
const [courseData, setCourseData] = useState([])



useEffect(() => {
  const fetchData = async () => {
    try {
        let enrolledCourseResponse = await axios.get(`${BASE_URL}/enrollments/${loggedInUser.email}`);
        enrolledCourseResponse = enrolledCourseResponse.data;
        let parsedEnrollments =[]
        enrolledCourseResponse.map(async(enrollment) => 
        {
          let data = await axios.get(`${BASE_URL}/course/courseInfo/id/${enrollment.courseID}`);
          let course = data.data.course
          parsedEnrollments.push({
            courseCode: course?.courseCode,
            courseID: course?.courseId,
            courseName: course?.courseName,
            professorName: course.instructorEmail,
            description: course?.description,

          })
        })
        setCourseData(parsedEnrollments);
    } catch (error) {
      console.error('Error fetching enrollments:', error);
    }
  };
  fetchData();
}, [])

const payload = JSON.parse(localStorage.getItem('jsonwebtoken'))
if (payload && !loggedInUser){ 
  dispatch({
    type:'LOGIN',
    payload
  }
  )
  setLoggedInUser(payload)
}

const [assignments, setAssignments] = useState([]);

const [announcements,setAnnouncements]= useState()
//Announcements
useEffect(() => {
  const fetchData = async () => {
    try {
        let announcementResponse = await axios.get(`${BASE_URL}/api/user/enrolledCoursesAnnouncements/${payload.email}`);
        announcementResponse = announcementResponse.data.announcements;
        let parsedAnnouncements = [];
        for(let announcement of announcementResponse)
        {
          let course = await axios.get(`${BASE_URL}/course/courseInfo/id/${announcement.courseID}`);
          // let instructor = await axios.post(`${BASE_URL}/api/users/find`, {
          //   email: course.data.course.instructorEmail
          // });
          
          let courseName = course.data.course.courseName;
          let courseCode = course.data.course.courseCode;
          //let name = instructor.data.fname + " " + instructor.data.lname;

          parsedAnnouncements.push(
            {
              courseCode:courseCode,
              courseName:courseName,
              title: announcement.title,
              message:announcement.message,
              email:announcement.email?announcement.email:"",
              name:announcement.name?announcement.name:"",
              datePosted:announcement.date

            }
          )
        }
      setAnnouncements(parsedAnnouncements);
    } catch (error) {
      console.error('Error fetching assignments:', error);
    }
  };

  fetchData();
}, []);

useEffect(() => {
  const fetchData = async () => {
    try {
        let assignmentResponse = await axios.get(`${BASE_URL}/assignments`);
        assignmentResponse = assignmentResponse.data;
        let parsedAssignments =[]
        assignmentResponse.map(async(assignment) => 
        {
          let course = await axios.get(`${BASE_URL}/course/courseInfo/id/${assignment.courseID}`);
          let courseName = course.data.course.courseName;
          let courseCode = course.data.course.courseCode;

          parsedAssignments.push(
            {
              assignmentId: assignment._id,
              type: 'assignment',
              title: assignment.title,
              courseName: courseName,
              courseCode: courseCode,
              description: assignment.description?assignment.description:"",
              file: assignment.fileURL,
              dueDate: new Date(assignment.dueDate),
              closeDate: new Date(assignment.closeDate),
              maxMarks: assignment.maxPoints,
            }
          )
        })
        setAssignments(parsedAssignments);
    } catch (error) {
      console.error('Error fetching assignments:', error);
    }
  };
  fetchData();
}, []);

const [assignmentSubmissions,setAssignmentSubmissions] = useState()

useEffect(() => {
  const fetchData = async () => {
    try {
        let submissionResponse = await axios.get(`${BASE_URL}/submissions`);
        submissionResponse = submissionResponse.data;

        let parsedSubmissions = [];
        for(let submission of submissionResponse)
        {
          // let course = await axios.get(`${BASE_URL}/course/courseInfo/id/${submission.courseID}`);
          
          // let courseName = course.data.course.courseName;
          // let courseCode = course.data.course.courseCode;

          parsedSubmissions.push(
            {
              submissionId: submission._id,
              assignmentId: submission.assignmentID,
              user: submission.userID, 
              time: new Date(submission.submissionDate),
              link: submission.submissionURL, 
              marks: submission.grade
            }
          )
        }
      setAssignmentSubmissions(parsedSubmissions);
    } catch (error) {
      console.error('Error fetching assignments:', error);
    }
  };

  fetchData();
}, []);





if (pastTheme && pastTheme !== theme){setTheme(pastTheme)}
else if (!pastTheme){ localStorage.setItem('theme',theme)}

const CardId = () => {
  let params = useParams()
  async function getCourseSubmissions ({assignmentSubmissions,id}) {
    let parsedSubmissions=[]
    if(assignmentSubmissions) {
      for (const submission in assignmentSubmissions) {
        if(submission.assignmentId) {
          let course = await axios.get(`${BASE_URL}/course/courseInfo/id/${submission.assignmentId}`);
          if (course.data.course.courseCode === id) {
            parsedSubmissions.push(submission)
          }
        }
      }
    }
    return parsedSubmissions
  }

  let cardData = courseData?.filter((subject) => subject.courseCode === params.cardId)[0]
  return (
    cardData ? 
    <IndCard key={params.cardId}
      card={cardData}

      assignments={assignments && assignments.filter((assignment) => assignment.courseCode === params.cardId)}

      announcements = {
        announcements && announcements.filter((announcement) => announcement.courseCode === params.cardId)
      }
      assignmentSubmissions={assignmentSubmissions}
      setAnnouncements = {setAnnouncements}
    />
    : <NotFound />
  );
};



return (
    <div className='main-container'>
      <div className='main-wrapper'>
        <Navbar loggedInUser={loggedInUser} setLoggedInUser={setLoggedInUser}/>
      </div>
      <Routes>
        <Route index element={<LandingPage />}/>
        <Route path ='login' element={loggedInUser?loggedInUser.type === 'Admin'?<Navigate replace to ='/admindashboard'/>:<Navigate replace to ='/dashboard'/>:<LoginPage users={users} setLoggedInUser={setLoggedInUser}/>} /> 
        <Route element={<AdminRoute user={loggedInUser}/>}>
          <Route path = 'admindashboard' element={<AdminDashboard />}/>
        </Route>
        <Route element={<PrivateRoute user={loggedInUser} setLoggedInUser={setLoggedInUser}/>}>
          <Route path="/enroll" element={loggedInUser?.type === 'Student' ?<Enroll enrolledCourses={courseData}/>:<NotFound />}/>
          <Route path="dashboard" element={<Dashboard announcements={announcements} user={loggedInUser} graduateDegreeData={courseData} setCourseData = {setCourseData}/>}/>
          <Route path="/dashboard/:cardId/*" element={<CardId />} />
        </Route>
        {/* <Route element={<LockedRoute user={loggedInUser}/>}>
          <Route path='profile' element={<ProfilePage user={loggedInUser}/>}/>
        </Route> */}
        <Route path='*' element={loggedInUser?<NotFound />:<Navigate replace to ="/login"/>}/>
      </Routes>
    </div>
  )
}

export default Main