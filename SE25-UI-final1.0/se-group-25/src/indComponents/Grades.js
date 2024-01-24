import React, { useContext, useState } from 'react'
import ThemeContext from '../context/ThemeContext'
import "./styles/grades.css"
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import { Modal } from 'react-bootstrap';
import AcUnitRoundedIcon from '@mui/icons-material/AcUnitRounded';
import axios from 'axios'
import BASE_URL from '../shared/baseURL';
import Success from '../components/Success';
import Loading from '../components/Loading';

const Grades = ({user,assignments,assignmentSubmissions,cardData}) => {
  const {theme} = useContext(ThemeContext)
  let userSubmissions =  []
  for(const assignment in assignments) {
    for (const submission in assignmentSubmissions) {
      if (assignmentSubmissions[submission].assignmentId === assignments[assignment].assignmentId) {
        userSubmissions.push(assignmentSubmissions[submission])
      }
    }
  }
  const [showGradingTool, setShowGradingTool] = useState('')
  function calculateGrade(assignments,marks) {
    let my_marks = 0
    let highest_marks= 0
    assignments.map((assignment,id) => {
      if (marks[id]){
        if (marks[id].marks !== -1) {
        my_marks += (marks[id].marks)
        highest_marks += (assignment.maxMarks)
      }}
      else {
        if (new Date() > assignment.dueDate) {
        highest_marks += (assignment.maxMarks)
      }}
    })
    let percentage = (my_marks/highest_marks)*100
    let letterGrade = 'F';
    let color = 'red'
      if(percentage >= 97)
        {
          letterGrade = 'A+'
          color = 'green'
        }
      else if(percentage > 93)
        {
          letterGrade = 'A';
          color = 'green'
        }
      else if(percentage > 90)
        {
          letterGrade = 'A-';
          color = 'green'
        }
      else if(percentage > 87)
        {
          letterGrade = 'B+';
          color = 'green'
        }
      else if(percentage > 83)
        {
          letterGrade = 'B';
          color = 'green'
        }
      else if(percentage > 80)
        {
          letterGrade = 'B-';
          color = 'green'
        }
      else if(percentage > 77)
        {
          letterGrade = 'C+';
          color = 'yellow'
        }
      else if(percentage > 73)
        {
          letterGrade = 'C';
          color = 'yellow'
        }
      else if(percentage > 70)
        {
          letterGrade = 'C-';
          color = 'orange'
        }
      else if(percentage > 67)
        {
          letterGrade = 'D+';
          color = 'orange'
        }
      else if(percentage > 65)
        {
          letterGrade = 'D';
          color = 'orange'
        }
    return [letterGrade,percentage,color]
  }

  const grade = calculateGrade(assignments,userSubmissions)
  return (
    <div className={`canvas-content content-${theme}`}>
      <div className={`canvas-header canvas-header-${theme}`}>
        <div className="ind-assignment-header">
          <h1>Grades</h1>
          {user.type === 'Student' ? <div><h1>Grade:</h1>
            <h1 style={{color: grade[2]}}> {grade[1].toFixed(2)}% [{grade[0]}] </h1>
          </div>:<></>}
        </div>
      </div>
      {
        showGradingTool === '' ? 
        user.type === 'Student' ?
        <div className='grades-container'>
          <div className='assignment-list-container'>
            {assignments.map((assignment) => {
            return(
              <div>
                <AssignmentCard user={user} assignment={assignment} submissions={userSubmissions.filter((submission) => submission.assignmentId === assignment.assignmentId)[0]} setShowGradingTool={setShowGradingTool}/>
              </div>
            )
          })}
          </div>
        </div>
        
        : 
        user.type === "Instructor" ? 
        <div className='grades-container'>
          <div className='assignment-list-container'>
          {assignments.map((assignment) => {
            return(
              <div>
                <AssignmentCard user={user} assignment={assignment} submissions={assignmentSubmissions?.filter((submission) => submission.assignmentId === assignment.assignmentId)} setShowGradingTool={setShowGradingTool}/>
              </div>
            )})}
            </div>
        </div>:<>Unapproved</>
        :
        <GradeCard assignment={assignments.filter((a) => a.assignmentId === showGradingTool)[0]} submissions={assignmentSubmissions?.filter((submission) => submission.assignmentId === showGradingTool)} setShowGradingTool={setShowGradingTool}/>
      }
    </div>
  )
}

const AssignmentCard = ({user, assignment,submissions, setShowGradingTool}) => {
  const {theme} = useContext(ThemeContext)
  const handleClick = (type,id) => {
    setShowGradingTool(type === 'Instructor' ? id : "")
  }
  return(
    <div className={`assignment-list-wrapper subcard-${theme}`} onClick={() => handleClick(user.type,assignment.assignmentId)}>
      <div className='assignment-list-title'>
        {assignment.title}
      </div>
        <div>
            {user.type === 'Student' ? submissions?
            submissions.marks === -1 ?
              <div>
                Not yet graded/{assignment.maxMarks}

              </div>
              : 
              <div>{submissions.marks}/{assignment.maxMarks}</div>
              :
              <div>
                Not Submitted
              </div>
              :
              user.type === 'Instructor' ? 
                Date.now() < assignment.dueDate ?
                <div>
                  Not yet Submitted
                </div>
                : 
                <div>
                  {submissions?<>{calculateMeanMarks(assignment,submissions)}/{assignment.maxMarks}</>: <>'Not Yet Submitted'</>}
                </div>
              :
              <></>
            }
        </div>
      </div>
  );
}



const GradeCard = ({assignment, submissions,setShowGradingTool}) => {
  const [showTool, setShowTool] = useState(false)
  const [data, setData] = useState ()
  const [success,setSuccess] = useState(null)
  const [isLoading,setLoading] = useState(false)
  const {theme} = useContext(ThemeContext)

  const handleClick = ({submission}) => {
    setData(submission)
    setShowTool(true)
  }

  const handleGradeSubmit = async(submission) => {
    setLoading(true)
    let gradedSubmission = {
      assignmentID: submission.assignmentId, 
      grade: submission.marks, 
      userID: submission.user, 
      submissionURL: submission.link,
      submissionDate: submission.time,
    }
    await axios.put(`${BASE_URL}/submissions/${data.submissionId}`,gradedSubmission
    ).then((res) => {
      console.log(res)
      setLoading(false)
      setSuccess(true)
    },(error) => {
      console.log(error)
      setLoading(false)
      setSuccess(false)
    })

    
  setTimeout(()=> {
    setShowTool(false)
    setSuccess(null)
  },5000)
  }

  return(
    <div>
      <button className={`back-btn-${theme}`} onClick={() => setShowGradingTool('')}><ArrowBackRoundedIcon /></button>

      <div className='assignment-view-container'>
          <div className={`submission-header subheader-${theme}`}>{assignment.title} - Submissions</div>
      {
        submissions?.map((submission) => {
          return(
            <div className='assignment-view-wrapper' onClick={() => handleClick({submission})}>
              <div className={`assignment-submission-view  subcard-${theme}`}>
                <div className='submit-user-info'>
                  <div className="submit-user">{submission.user}</div>
                  <div className="submit-time">Submitted at: {submission.time.toLocaleString()}</div>
                </div>
                <div className='assignment-grades'>
                <div>
                {submission.marks !== -1 ? 
                  <div>
                    {submission.marks}/{assignment.maxMarks}
                  </div> 
                  : <><AcUnitRoundedIcon style={{fontSize: "18px"}}/>/{assignment.maxMarks}</>}
                </div>
                  <div>
                    {assignment.dueDate < submission?.time ? <div className='late-tag'>late</div>:<></>}
                  </div>
              </div>
              </div>
            </div>
          );
        })
      }
      </div>
      <Modal show={showTool} onHide={() => setShowTool(false)} id={`modal-${theme}`} size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered>
        <Modal.Header closeButton>
          <Modal.Title>Grade Tool</Modal.Title>
        </Modal.Header>
        <Modal.Body className='modal-form'>
          {isLoading 
          ? 
          <Loading />
          :
          success === null ?
            <div className='grade-tool-body'>
              <div className='grade-tool-info-wrapper'>
                <div className='grade-tool-info'>
                  {data?.user}
                  <div>
                    {assignment.dueDate < data?.time ? <div className='late-tag'>late</div>:<></>}
                  </div>
                </div>
                <div>Submitted at: {data?.time.toLocaleString()}</div>
              </div>
              <div className='grade-tool-marks'>
                <label>Marks</label>
                <input type="number" value={data?.marks === -1 ? 0 : data?.marks} onChange={(e) => setData({...data, marks: parseInt(e.target.value)})}/>
              </div>
            </div>
          :
          <Success success={success}/>
          }
        </Modal.Body>
        <Modal.Footer>
          <button className='btn-black' onClick={() => handleGradeSubmit(data)}>Submit Grade</button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}


function calculateMeanMarks (assignment,sub) {
    let submission_marks = 0
    let highest_marks = 0
    sub.map((mark) => {
      if (mark) {
        if (mark.marks !== -1) {
          submission_marks += (mark.marks)
          highest_marks += (assignment.maxMarks)
        }}
        else {
          if (new Date() > assignment.dueDate) {
          highest_marks += (assignment.maxMarks)
        }}
    })
    
    let mean_marks = (submission_marks)/(highest_marks)
    return mean_marks*assignment.maxMarks
  }
export default Grades