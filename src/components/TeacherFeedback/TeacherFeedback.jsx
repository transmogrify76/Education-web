import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import './TeacherFeedback.css';
import Header from '../Header/Header';

// Enum for feedback answers
const AnswerEnum = {
  Agree: 'Agree',
  Neutral: 'Neutral',
  Disagree: 'Disagree',
};

const TeacherFeedback = () => {
  const [students, setStudents] = useState([]);
  const [studentId, setStudentId] = useState('');
  const [teacherName, setTeacherName] = useState(''); 
  const [parentName, setParentName] = useState('');
  const [userId, setUserId] = useState(null);
  const [feedbackQuestions, setFeedbackQuestions] = useState([]);
  const [responses, setResponses] = useState({
    ans1: AnswerEnum.Neutral,
    ans2: AnswerEnum.Neutral,
    ans3: AnswerEnum.Neutral,
    ans4: AnswerEnum.Neutral,
    ans5: AnswerEnum.Neutral,
    ans6: AnswerEnum.Neutral,
    ans7: AnswerEnum.Neutral,
    ans8: AnswerEnum.Neutral,
    ans9: AnswerEnum.Neutral,
    ans10: AnswerEnum.Neutral,
  });
  const [studentDetails, setStudentDetails] = useState(null);
  const [subjects, setSubjects] = useState([]); 
  const [selectedSubject, setSelectedSubject] = useState(''); 
  const navigate = useNavigate();
  const { userId: paramUserId } = useParams();

  useEffect(() => {
    // Get the JWT token from localStorage
    const token = localStorage.getItem('authToken');

    if (token) {
      const decodedToken = jwtDecode(token);
      const userIdFromToken = decodedToken.id;

      setUserId(userIdFromToken);

      if (paramUserId && paramUserId !== userIdFromToken.toString()) {
        navigate(`/teacher-feedback/${userIdFromToken}`);
      }

      axios.get(`http://192.168.0.103:3000/parent/${userIdFromToken}`)
        .then(response => {
          const parentData = response.data;
          setParentName(parentData.name);
          if (parentData.students && parentData.students.length > 0) {
            setStudents(parentData.students);
          }
        })
        .catch(error => {
          console.error('Error fetching parent details:', error);
          alert('Failed to fetch parent details');
        });

      axios.get(`http://192.168.0.103:3000/teacher/${userIdFromToken}`)
        .then(response => {
          const teacherData = response.data;
          setTeacherName(teacherData.name);
        })
        .catch(error => {
          console.error('Error fetching teacher details:', error);
          alert('Failed to fetch teacher details');
        });

      axios.get('http://192.168.0.103:3000/teacher-feedback/teacher-feedback-questionnaire')
        .then(response => {
          const questions = response.data;
          setFeedbackQuestions(questions);
        })
        .catch(error => {
          console.error('Error fetching feedback questions:', error);
          alert('Failed to fetch feedback questions');
        });
    }
  }, [paramUserId, navigate]);

  const fetchStudentDetails = (studentId) => {
    axios.get(`http://192.168.0.103:3000/student/${studentId}`)
      .then(response => {
        const studentData = response.data;
        setStudentDetails(studentData);
        fetchSubjectsForClass(studentData.class.id);
      })
      .catch(error => {
        console.error('Error fetching student details:', error);
        alert('Failed to fetch student details');
      });
  };

  const fetchSubjectsForClass = (classId) => {
    axios.get(`http://localhost:3000/subjects/class/${classId}`)
      .then(response => {
        setSubjects(response.data); 
      })
      .catch(error => {
        console.error('Error fetching subjects:', error);
        alert('Failed to fetch subjects');
      });
  };

  const handleAnswerChange = (questionKey, answer) => {
    setResponses((prevResponses) => ({
      ...prevResponses,
      [questionKey]: answer,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!studentId) {
      alert('Please select a student.');
      return;
    }

    if (!selectedSubject) {
      alert('Please select a subject.');
      return;
    }

    const feedbackData = {
      studentClassId: studentDetails.class.id,
      subjectId: selectedSubject,
      ansJSON: responses,
    };

    try {
      const parentEmail = jwtDecode(localStorage.getItem('authToken')).email; // Get parent email from token
      await axios.post(`http://192.168.0.103:3000/teacher-feedback/parent/${parentEmail}`, feedbackData);
      alert('Feedback submitted successfully!');
    } catch (error) {
      console.error('Error submitting feedback:', error);
      alert('Failed to submit feedback');
    }
  };

  const handleStudentSelect = (e) => {
    const selectedStudentId = e.target.value;
    setStudentId(selectedStudentId);

    if (selectedStudentId) {
      fetchStudentDetails(selectedStudentId);
    }
  };
  const handleSubjectSelect = (e) => {
    setSelectedSubject(e.target.value);
  };
  return (
    <div>
      <Header />
      <div className="feedback-container">
        <div className="feedback-form">
          <h2>Teacher Feedback</h2>
          <p>Teacher: {teacherName}</p>
          {parentName && <p>Parent: {parentName}</p>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Select Student</label>
              <select value={studentId} onChange={handleStudentSelect}>
                <option value="">Select a student</option>
                {students.length > 0 ? (
                  students.map((student) => (
                    <option key={student.id} value={student.id}>
                      {student.name} {/* Removed Class ID display */}
                    </option>
                  ))
                ) : (
                  <option value="">No students available</option>
                )}
              </select>
            </div>

            {studentDetails && (
              <div className="form-group">
                <label>Select Subject</label>
                <select value={selectedSubject} onChange={handleSubjectSelect}>
                  <option value="">Select a subject</option>
                  {subjects.length > 0 ? (
                    subjects.map((subject) => (
                      <option key={subject.id} value={subject.id}>
                        {subject.name} {/* Removed Subject ID display */}
                      </option>
                    ))
                  ) : (
                    <option value="">No subjects available</option>
                  )}
                </select>
              </div>
            )}

            <div className="form-group">
              <label>Feedback Questions</label>
              {feedbackQuestions.length > 0 ? (
                feedbackQuestions.map((question) => (
                  <div key={question.key}>
                    <label>{question.question}</label>
                    <div>
                      {Object.values(AnswerEnum).map((answer) => (
                        <label key={answer}>
                          <input
                            type="radio"
                            name={question.key}
                            value={answer}
                            checked={responses[question.key] === answer}
                            onChange={() => handleAnswerChange(question.key, answer)}
                          />
                          {answer}
                        </label>
                      ))}
                    </div>
                  </div>
                ))
              ) : (
                <p>No feedback questions available</p>
              )}
            </div>

            <button type="submit" className="submit-btn">Submit Feedback</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TeacherFeedback;
