import React, { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode'; 
import Sidebar from '../SideNav/SideNav';
import './StudentWellbeingForm.css';
import Header from '../Header/Header';

const StudentWellbeingForm = () => {
  const [studentData, setStudentData] = useState({
    name: '',
    enroll: '',
    class: '',
    difficultyMessage: '',
    talkBrieflyMessage: '',
    problemSolvingMessage: '',
    helpOptions: []
  });

  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(null);
  const [studentId, setStudentId] = useState(null); // Store the decoded studentId

  // Decode the JWT token to get studentId
  useEffect(() => {
    const token = localStorage.getItem('authToken'); // Get token from localStorage
    if (token) {
      try {
        const decodedToken = jwtDecode(token); // Decode the token
        setStudentId(decodedToken.Id); // Set the studentId from decoded token
      } catch (error) {
        console.error('Failed to decode JWT token:', error);
        setError('Failed to decode JWT token');
      }
    } else {
      setError('No token found');
    }
  }, []);

  // Fetch student data once studentId is available
  useEffect(() => {
    if (studentId) {
      console.log('Fetching data for studentId:', studentId); // Log studentId for debugging

      const fetchStudentData = async () => {
        try {
          const response = await fetch(`http://localhost:3000/student-wellbeing/${studentId}`); // Fetch based on studentId
          console.log('Response Status:', response.status); // Log the status code
          
          if (!response.ok) {
            throw new Error(`Network response was not ok. Status: ${response.status}`);
          }

          const data = await response.json();
          setStudentData((prevState) => ({
            ...prevState,
            name: data.name,
            enroll: data.enrollmentNo,
            class: data.class
          }));
        } catch (error) {
          console.error('Error fetching student data:', error);
          setError('Error fetching student data: ' + error.message);
        } finally {
          setLoading(false);
        }
      };

      fetchStudentData();
    } else {
      setLoading(false); // Stop loading if no studentId
    }
  }, [studentId]);

  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;
    setStudentData((prevState) => {
      if (checked) {
        return {
          ...prevState,
          helpOptions: [...prevState.helpOptions, value]
        };
      } else {
        return {
          ...prevState,
          helpOptions: prevState.helpOptions.filter((option) => option !== value)
        };
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const helpOption = studentData.helpOptions.join(', ') || 'No help needed';

    const payload = {
      studentId: studentId,
      name: studentData.name,
      enrollmentNumber: studentData.enroll,
      class: studentData.class,
      difficultyMessage: studentData.difficultyMessage,
      talkBrieflyMessage: studentData.talkBrieflyMessage,
      problemSolvingMessage: studentData.problemSolvingMessage,
      helpOption: helpOption
    };

    try {
      const response = await fetch('http://localhost:3000/student-wellbeing', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        alert('Wellbeing form submitted successfully');
        // Reset the user input fields while keeping name and enroll populated
        setStudentData((prevState) => ({
          ...prevState,
          class: '',
          difficultyMessage: '',
          talkBrieflyMessage: '',
          problemSolvingMessage: '',
          helpOptions: []
        }));
      } else {
        throw new Error('Failed to submit form');
      }
    } catch (error) {
      setError('Error submitting form: ' + error.message);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className='for-header'>
      <Header />

      <div className="containerss">
        <Sidebar studentId={studentId} />
        <div className="student-wellbeing-form">
          <h2 className="form-heading">Student Wellbeing</h2>

          <div className="form-group">
            <div className="form-fields">
              <label htmlFor="name">Name:</label>
              <input
                type="text"
                id="name"
                className="input-box"
                value={studentData.name}
                readOnly
              />
            </div>
            <div className="form-fields">
              <label htmlFor="enroll">Enroll:</label>
              <input
                type="text"
                id="enroll"
                className="input-box"
                value={studentData.enroll}
                readOnly
              />
            </div>
            <div className="form-fields">
              <label htmlFor="class">Class:</label>
              <input
                type="text"
                id="class"
                className="input-box"
                value={studentData.class}
                onChange={(e) => setStudentData({ ...studentData, class: e.target.value })}
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-field">
              <label htmlFor="difficulty">I have difficulty with:</label>
              <textarea
                id="difficulty"
                className="input-box"
                value={studentData.difficultyMessage}
                onChange={(e) => setStudentData({ ...studentData, difficultyMessage: e.target.value })}
              ></textarea>
            </div>
            <div className="form-field">
              <label htmlFor="talk">I need to briefly talk about:</label>
              <textarea
                id="talk"
                className="input-box"
                value={studentData.talkBrieflyMessage}
                onChange={(e) => setStudentData({ ...studentData, talkBrieflyMessage: e.target.value })}
              ></textarea>
            </div>
            <div className="form-field">
              <label htmlFor="solutions">What have I done to try and solve the problem:</label>
              <textarea
                id="solutions"
                className="input-box"
                value={studentData.problemSolvingMessage}
                onChange={(e) => setStudentData({ ...studentData, problemSolvingMessage: e.target.value })}
              ></textarea>
            </div>
          </div>
          <div className="checkbox-group">
            <label>
              <input
                type="checkbox"
                value="I need your help"
                onChange={handleCheckboxChange}
              />
              I need your help
            </label>
            <label>
              <input
                type="checkbox"
                value="I am managing at present but I need to talk"
                onChange={handleCheckboxChange}
              />
              I am managing at present but I need to talk
            </label>
            <label>
              <input
                type="checkbox"
                value="I can wait for a week"
                onChange={handleCheckboxChange}
              />
              I can wait for a week
            </label>
          </div>
          <div className="form-actions">
            <button className="save-button" onClick={handleSubmit}>
              Save
            </button>
            <button
              className="cancel-button"
              onClick={() =>
                setStudentData((prevState) => ({
                  ...prevState,
                  class: '',
                  difficultyMessage: '',
                  talkBrieflyMessage: '',
                  problemSolvingMessage: '',
                  helpOptions: []
                }))
              }
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentWellbeingForm;
