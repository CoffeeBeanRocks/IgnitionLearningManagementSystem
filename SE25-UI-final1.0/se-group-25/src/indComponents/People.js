import React, { useContext, useEffect, useState } from 'react'
import ThemeContext from '../context/ThemeContext'
import axios from 'axios'
import BASE_URL from '../shared/baseURL'
import Loading from '../components/Loading'
import './styles/people.css'


const People = ({card}) => {
  const {theme} = useContext(ThemeContext)
  const [isLoading, setLoading] = useState(true)
  const [people,setPeople] = useState()

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
          let enrollmentResponse = await axios.get(`${BASE_URL}/enrollments`);
          enrollmentResponse = enrollmentResponse.data;
  
          let parseEnrollment = [];
          for(let enrollment of enrollmentResponse)
          {
            // let course = await axios.get(`${BASE_URL}/course/courseInfo/id/${submission.courseID}`);
            
            // let courseName = course.data.course.courseName;
            // let courseCode = course.data.course.courseCode;
  
            parseEnrollment.push(
              {enrollment}
            )
          }
        if (parseEnrollment) {
          let parsedPeople = []
          for (const index in parseEnrollment) {
            const enrollment = parseEnrollment[index]?.enrollment
            if (enrollment?.courseID === card?.courseID) {
              let person = await axios.post(`${BASE_URL}/api/users/find`, {
                  email: enrollment?.userID
              });
              parsedPeople.push(
                {
                  email: person.data.user.email,
                  name: person.data.user.fname+ ' '+person.data.user.lname,
                  type: person.data.user.type
                })
              }
            }
          setPeople(parsedPeople.sort(function(a,b) {
            return a.type-b.type || a.name - b.name;
          }))
          setLoading(false)
        }
      } catch (error) {
        console.error('Error fetching person:', error);
        setLoading(false)
      }
    };
    fetchData();
  }, []);
  
  return (
    <div className={`canvas-content content-${theme}`}>
      <div className={`canvas-header canvas-header-${theme}`}>
        <h1>People</h1>
      </div>
      {isLoading ? <Loading />
      : 
      <table className={`table table-${theme}`}>
        <thead className='table-row'>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Type</th>
            </tr>
        </thead>
        <tbody>
        {people?.map((person) => {
          return(
            <tr className='table-row'>
              <th className='table-row-name'>{person.name}</th>
              <th className='table-row-email'>{person.email}</th>
              <th className='table-row-type'>{person.type}</th>
            </tr>
          );
        })}
        </tbody>
      </table>
      }
    </div>
  )
}

export default People