import React, { useContext, useState } from 'react'
import ThemeContext from '../context/ThemeContext'
import Modal from 'react-bootstrap/Modal'
import './styles/assignments.css'
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import Select from 'react-select';
import Datetime from "react-datetime";
import "react-datetime/css/react-datetime.css";
import axios from 'axios';
import PDFModal from './PDFModal';
import BASE_URL from '../shared/baseURL';
import Loading from '../components/Loading';
import Success from '../components/Success';
import { Link, Route, Routes, useNavigate } from 'react-router-dom';

const Assignments = ({card, loggedInuser,ass,assignmentSubmissions}) => {
  const {theme} = useContext(ThemeContext)
  const [showAssignment, setShowAssignment] = useState()
  const [showModal,setShowModal] = useState(false)
  let assignments = ass
  const [newAssignment, setNewAssignment] = useState({
    title:"",
    courseName:card?.courseName,
    courseCode: card?.courseCode,
    description: "",
    file: null,
    dueDate: new Date(),
    closeDate: new Date(),
    maxMarks: 100,
  })

  
  const [isLoading, setLoading] = useState(false)
  const [success,setSuccess] = useState(null)
  let user = loggedInuser
  // user.type = "Student"

  const handleNewAssignment = async () => {
    setLoading(true)
    //TODO: Call API here
    const formData = new FormData();
    formData.append('file', newAssignment.file);

    let fileURL = ""
    await axios.post(`${BASE_URL}/files/upload`,formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }
    ).then((response) => {
      fileURL = response.data.fileUrl
    },(error) => {
      console.log(error)
    })

    await axios.post(`${BASE_URL}/assignments/create`, {
      courseName: newAssignment.courseName, 
      description: newAssignment.description, 
      title: newAssignment.title, 
      file: fileURL,
      dueDate: newAssignment.dueDate,
      closeDate: newAssignment.closeDate, 
      maxPoints: newAssignment.maxMarks
    }).then((response)=> {
      console.log(response)
      setLoading(false)
      setSuccess(true)
    },(error)=>{
      console.log(error)
      setLoading(false)
      setSuccess(false)
    });

    setTimeout(() =>
      {setShowModal(false)
      setSuccess(null)},
      5000)
  }
  return (
    <div className={`canvas-content content-${theme}`}>
      <Routes>
        <Route index element={
          <div>
        <div className={`canvas-header canvas-header-${theme} canvas-assignment-header`}>
          <h1>Assignment</h1>
          {user.type === "Instructor" ? 
          <div className='create-assignment'>
            <button className={`create-btn create-btn-${theme}`} onClick={() => setShowModal(true)}>Create New Assignment</button>
            <Modal show={showModal} onHide={() => setShowModal(false)} id={`modal-${theme}`} size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered>
              <Modal.Header closeButton>
                <Modal.Title>Create Assignment</Modal.Title>
              </Modal.Header>
              <Modal.Body className="modal-form">
                  {isLoading ? <Loading /> :
                  success === null ? 
                  <div>
                    <div className='input-div'>
                      <label>Name</label>
                      <input type='text' value={newAssignment.name} onChange={(e)=>setNewAssignment({...newAssignment, title: e.target.value})}/>
                    </div>
                    {/* <div className='input-div-file'>
                      <label>Type</label>
                      <Select options={options} defaultValue={options[0]} onChange={(e)=>setNewAssignment({...newAssignment, type: e.value})} 
                      theme={(theme) => ({
                        ...theme,
                        colors: {
                          ...theme.colors,
                          primary25: '#ffd0d0',
                          primary: 'red',
                          primary50: '#ff9494'
                        }
                      })}/>
                    </div> */}
                    <div className='input-div'>
                      <label>Description</label>
                      <textarea type='text' value={newAssignment.description} onChange={(e)=>setNewAssignment({...newAssignment, description: e.target.value})}/>
                    </div>
                    <div className='input-div-file file-upload-btn'>
                      <label>File</label>
                      <input type='file' onChange={(e)=>setNewAssignment({...newAssignment, file: e.target.files[0]})}/>
                    </div>
                    <div className='input-div'>
                      <label>Due Date</label>
                      <Datetime onChange={(e)=>setNewAssignment({...newAssignment, dueDate: e._d})}/>
                    </div>
                    <div className='input-div'>
                      <label>Close Date</label>
                      <Datetime onChange={(e)=>setNewAssignment({...newAssignment, closeDate: e._d})}/>
                    </div>
                    <div className='input-div'>
                      <label>Maximum Marks</label>
                      <input type='number' value={newAssignment.maxMarks} onInput={(e)=>setNewAssignment({...newAssignment, maxMarks: parseInt(e.target.value, 10)})}/>
                    </div>
                  </div>:
                  <Success success={success}/>
                  }
              </Modal.Body>
              <Modal.Footer><button className="btn-red" onClick={() => handleNewAssignment()}>Submit</button></Modal.Footer>
              </Modal>
          </div>
        : <></>}
        </div>
        <div>
        {user.type === "Student" || user.type === 'Instructor' ? 
        <div className='assignment-list-container'>
          {assignments?.map((assignment) => {
            return(<div onClick={() => setShowAssignment(assignment)}>
            <AssignmentCard user={user} assignment = {assignment} submissions={assignmentSubmissions}/>
          </div>)
            })
          }
        </div>: <>Unapproved</>}</div></div>} />
          <Route path={`${showAssignment?.title}`} element={<IndividualAssigment card={card} user={user} assignment = {showAssignment} submissions= {assignmentSubmissions} setShowAssignment={setShowAssignment}/>} />
        </Routes>
    </div>
  )
}

const AssignmentCard = ({user, assignment,submissions}) => {
  const {theme} = useContext(ThemeContext)
  return(
    <Link className='card-links' to={assignment.title}>
    <div className={`assignment-list-wrapper subcard-${theme}`}>
      <div className='assignment-list-title'>
        {assignment.title}
      </div>
      <div className='assignment-list-dueDate'>
        <div>Due Date: </div>
        <div>
        {assignment.dueDate.toLocaleDateString(undefined, {
          year: "numeric",
          month: "2-digit",
          day: "2-digit"
        })}
        </div>
      </div>
    </div>
    </Link>
  );
}


const IndividualAssigment = ({card,user,assignment,submissions,setShowAssignment}) => {
  const {theme} = useContext(ThemeContext)
  const [file,setFile] = useState(null);
  const assignmentSubmissions = submissions?.filter((submission) => submission.assignmentId === assignment.assignmentId)
  const userSubmission = assignmentSubmissions?.filter((submission) => submission.user === user.email)[0]
  const currDate = new Date();
  const [showLink, setShowLink] = useState(false)
  const [pdf, setPdfUrl] = useState('')
  const [success,setSuccess] = useState(null)
  const [isLoading,setLoading] = useState(false)
  let navigate = useNavigate()
  function handlePDFViewer(link) {
    setPdfUrl(link)
    setShowLink(true)
  }

  const handleFileUpload = async() => {
    setLoading(true)
    const formData = new FormData();
    formData.append('file', file);

    // Update the formData object
    let fileURL = ''

    await axios.post(`${BASE_URL}/files/upload`,formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }
    ).then((response) => {
      fileURL = response.data.fileUrl
    },(error) => {
      console.log(error)
    })
    // Details of the uploaded file

    await axios.post(`${BASE_URL}/submissions`,{
      assignmentID:assignment.assignmentId,
      grade:-1,
      userID:user.email,
      submissionURL:fileURL,
      submissionDate: new Date()
    }).then((response) => {
      console.log(response)
      setLoading(false)
      setSuccess(true)

    },(error)=> {
      console.log(error)
      setLoading(false)
      setSuccess(false)
    })

    setTimeout(()=> {
      setSuccess(null)
      navigate(`/dashboard/${card.courseCode}/assignments`)
    },5000)
  }

  return(
    <div>
      <div className={`canvas-header canvas-header-${theme}`}>
        <div className="ind-assignment-header">
          <h1>{assignment.title}</h1>
          {user.type === 'Student' ? 
            !userSubmission || userSubmission?.marks === -1 ? 
              <h1>Not Yet Graded</h1>
              : <h1>{userSubmission?.marks}/{assignment.maxMarks}</h1>
              :<></>
            }
        </div>
      </div>
      <div className='ind-assignment-body'>
        <div><Link to={`/dashboard/${card.courseCode}/assignments`} className={`back-btn-${theme}`}><ArrowBackRoundedIcon /></Link></div>
        <div className={`assignment-info subcard-${theme}`}>
          <div className="assignment-description">{assignment.description}</div>
          <div className="assignment-file">{assignment.file? <a className="pdf-open-btn" href='#' onClick={() => handlePDFViewer(assignment?.file)}>{assignment.title} - File</a>:<></>}</div>
          </div>
        {user.type === "Student" ?
        <div>
          {userSubmission?.link?
                <div className={`submitted-link subcard-${theme}`}>
                  <p>File Submitted at: {userSubmission.time.toLocaleString()}</p>
                  <a className="pdf-open-btn" href='#' onClick={() => handlePDFViewer(userSubmission?.link)}>Your File</a>
                </div>: <div></div>}
          
          {
            assignment.closeDate && currDate < assignment.closeDate && !userSubmission?
          isLoading ? <Loading />
          :
          success === null ?
          <div className={`assignment-upload-container subcard-${theme}`}>
          <div className='file-upload-btn'>
            <label> Upload file</label>
            <input type="file" onChange={(e) => setFile(e.target.files[0])}/>
          </div>
          <div>
            <button className='btn-red' onClick={handleFileUpload}>Submit</button>
          </div>
        </div>
          :<Success success={success}/>
          : userSubmission ?
          <></>
          : 
          <>You haven't submitted this assignment</>}
        </div>
        
        : 
        user.type === "Instructor" ? 
        <div className='assignment-view-container'>
          <div className={`submission-header subheader-${theme}`}>Submissions</div>
          {assignmentSubmissions?.map((submission,id) => {
            return(
              <div key={id} className='assignment-view-wrapper'>
                <div className={`assignment-submission-view subcard-${theme}`}>
                  <div className='submit-user-info'>
                    <div className="submit-user">{submission.user}</div>
                    <div className="submit-time">{submission.time.toLocaleString()}</div>
                  </div>
                  <div className='assignment-grades'>
                  <a href="#" onClick={() => handlePDFViewer(submission?.link)}>{assignment.title} - File</a>
                  </div>
              </div>
              </div>
            )
          })}
        </div>:
        <div>Unapproved</div>
        }
      </div>
      <PDFModal pdfURL={pdf} showLink={showLink} setShowLink={setShowLink} />
    </div>
  )
}
export default Assignments