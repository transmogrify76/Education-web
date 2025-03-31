import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {jwtDecode} from 'jwt-decode'; 
import Sidebar from '../SideNav/SideNav';
import Header from '../Header/Header';
import './StudentWellbeingForm.css';

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
  const [studentId, setStudentId] = useState(null);
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      try {
        const decodedToken = jwtDecode(token);  
        setStudentId(decodedToken.Id);  
      } catch (error) {
        console.error('Failed to decode JWT token:', error);
        setError('Failed to decode JWT token');
        setLoading(false); 
      }
    } else {
      setError('No token found');
      setLoading(false); 
    }
  }, []);
  useEffect(() => {
    if (studentId) {
      const fetchStudentData = async () => {
        try {
          const token = localStorage.getItem('authToken');
          if (!token) {
            setError('No auth token found');
            setLoading(false);
            return;
          }
          const config = {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          };
          const studentResponse = await axios.get(`http://192.168.0.103:3000/student-wellbeing`, config);
          if (studentResponse.data) {
            setStudentData((prevState) => ({
              ...prevState,
              name: studentResponse.data.name,
              enroll: studentResponse.data.enrollmentNo,
              class: studentResponse.data.class,
            }));
          } else {
            setError('Wellbeing record not found');
          }
          setLoading(false);
        } catch (err) {
          console.error('Error fetching student wellbeing data:', err);
          setError('Error fetching student wellbeing data: ' + (err.response?.data?.message || err.message));
          setLoading(false);
        }
      };
      fetchStudentData();
    } else {
      setLoading(false); // Stop loading if there's no studentId
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
      const token = localStorage.getItem('authToken');
      if (!token) {
        setError('No auth token found');
        return;
      }
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.post('http://192.168.0.103:3000/student-wellbeing', payload, config);
      if (response.status === 200) {
        alert('Wellbeing form submitted successfully');
        setStudentData({
          name: '',
          enroll: '',
          class: '',
          difficultyMessage: '',
          talkBrieflyMessage: '',
          problemSolvingMessage: '',
          helpOptions: []
        });
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
    return <div className="error-message">{error}</div>;
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
                setStudentData({
                  name: '',
                  enroll: '',
                  class: '',
                  difficultyMessage: '',
                  talkBrieflyMessage: '',
                  problemSolvingMessage: '',
                  helpOptions: []
                })
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
