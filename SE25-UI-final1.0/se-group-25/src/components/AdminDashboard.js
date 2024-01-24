import React, { useEffect, useState } from 'react';
import axios from 'axios';
import BASE_URL from '../shared/baseURL';

const AdminDashboard = () => {
  const [approvals, setApprovals] = useState([]);

  useEffect(() => {
    const fetchApprovals = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/admin/unapproved`);
        const processedApprovals = response.data.map(approval => ({
          Type: approval.Type,
          Name: approval.Name,
          SelectedUserValue: 'Student',
        }));

        setApprovals(processedApprovals);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchApprovals();
  }, []);

  const handleUserValueChange = (index, value) => {
    setApprovals(prevApprovals => {
      const newApprovals = [...prevApprovals];
      newApprovals[index].SelectedUserValue = value;
      return newApprovals;
    });
  };

  async function approveUser(email, index) {
    const userType = approvals[index].SelectedUserValue;

    try {
      await axios.patch(`${BASE_URL}/api/users/update/type`, { email, type: userType });

      alert(`${email} is approved as ${userType}!`);

      // If needed, you can update the state or re-fetch data after the approval
      // Example: Refetch data to update the list after approval
      const updatedApprovals = [...approvals];
      updatedApprovals.splice(index, 1); // Remove the approved user from the list
      setApprovals(updatedApprovals);
    } catch (error) {
      console.error('Error approving user:', error);
    }
  }

  async function approveCourse(courseId, index) {
    try {
      const status = 'Approved';
      await axios.put(`${BASE_URL}/course/updateStatus/${courseId}`, { status } );
  
      alert(`Course with ID ${courseId} is approved!`);
  
      const updatedApprovals = [...approvals];
      updatedApprovals.splice(index, 1);
      setApprovals(updatedApprovals);
    } catch (error) {
      console.error('Error approving course:', error);
    }
  }

  async function denyUser(email, index) {
    try {
      await axios.delete(`${BASE_URL}/api/users`, { data: { email } });

      alert(`${email} is denied and has been removed!`);

      const updatedApprovals = [...approvals];
      updatedApprovals.splice(index, 1);
      setApprovals(updatedApprovals);
    } catch (error) {
      console.error('Error denying user:', error);
    }
  }

  async function denyCourse(courseName, index) {
    try {
      await axios.delete(`${BASE_URL}/course/courseByName/${courseName}`);

      alert(`Course with name ${courseName} is denied and has been removed!`);

      const updatedApprovals = [...approvals];
      updatedApprovals.splice(index, 1);
      setApprovals(updatedApprovals);
    } catch (error) {
      console.error('Error denying course:', error);
      // Handle error as needed
    }
  }

  return (
    <div className="canvas-assignments">
      <h2>Approvals</h2>
      {approvals.map((approval, index) => (
        <div key={index} className="assignment-card">
          <h3>{approval.Type}</h3>
          <p>{approval.Name}</p>
          <button
            type="button"
            onClick={() => {
              if (approval.Type === 'User') {
                approveUser(approval.Name, index);
              } else if (approval.Type === 'Course') {
                approveCourse(approval.Name, index);
              }
            }}
          >
            Approve
          </button>
          <button
            type="button"
            onClick={() => {
              if (approval.Type === 'User') {
                denyUser(approval.Name, index);
              } else if (approval.Type === 'Course') {
                denyCourse(approval.Name, index);
              }
            }}
          >
            Deny
          </button>
          {approval.Type === 'User' && (
            <>
              <select
                name={`user-values-${index}`}
                id={`user-values-${index}`}
                value={approval.SelectedUserValue}
                onChange={(e) => handleUserValueChange(index, e.target.value)}
              >
                <option value="Student">Student</option>
                <option value="Teacher">Teacher</option>
                <option value="Admin">Admin</option>
              </select>
            </>
          )}
        </div>
      ))}
    </div>
  );
};

export default AdminDashboard;