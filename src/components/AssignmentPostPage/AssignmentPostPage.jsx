import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode'; // ✅ Added import
import './AssignmentPostPage.css';
import Header from '../Header/Header';

const AssignmentPostPage = () => {
  const [assignmentTitle, setAssignmentTitle] = useState('');
  const [assignmentDescription, setAssignmentDescription] = useState('');
  const [assignmentDueDate, setAssignmentDueDate] = useState('');
  const [classroomUrl, setClassroomUrl] = useState('');
  const [classList, setClassList] = useState([]);
  const [selectedClassId, setSelectedClassId] = useState('');
  const [assignmentHistory, setAssignmentHistory] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [ripple, setRipple] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);

  // ✅ Fetch only classes assigned to the teacher
  useEffect(() => {
    const fetchTeacherClasses = async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (!token) return;

        const decoded = jwtDecode(token);
        const teacherId = decoded?.id;

        if (teacherId) {
          const response = await axios.get(`http://192.168.0.103:3000/teacher/${teacherId}`);
          const teacher = response.data;
          const teacherClasses = Array.isArray(teacher.classes) ? teacher.classes : [];
          setClassList(teacherClasses);
        }
      } catch (error) {
        console.error('Error fetching teacher classes:', error);
        setErrorMessage('Failed to load assigned classes.');
      }
    };

    fetchTeacherClasses();
  }, []);

  // Fetch assignments for selected class
  useEffect(() => {
    const fetchAssignments = async () => {
      if (!selectedClassId) {
        setAssignmentHistory([]);
        return;
      }

      try {
        const response = await axios.get('http://192.168.0.103:3000/assignments');
        const filtered = response.data.filter(
          (assignment) => assignment.classId.toString() === selectedClassId
        );
        setAssignmentHistory(filtered);
      } catch (error) {
        console.error('Error fetching assignments:', error);
        setErrorMessage('Failed to load assignments.');
      }
    };

    fetchAssignments();
  }, [selectedClassId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const selectedDate = new Date(assignmentDueDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
      alert('Please select a valid due date.');
      return;
    }

    setIsAnimating(true);

    const formData = {
      title: assignmentTitle,
      description: assignmentDescription,
      dueDate: selectedDate,
      classroomLink: classroomUrl || null,
      classId: parseInt(selectedClassId, 10),
    };

    try {
      await axios.post('http://192.168.0.103:3000/assignments', formData, {
        headers: { 'Content-Type': 'application/json' },
      });
      alert('Assignment created successfully!');
      setAssignmentTitle('');
      setAssignmentDescription('');
      setAssignmentDueDate('');
      setClassroomUrl('');
      setIsAnimating(false);

      // Refresh assignment list
      const updated = await axios.get('http://192.168.0.103:3000/assignments');
      const filtered = updated.data.filter(
        (assignment) => assignment.classId.toString() === selectedClassId
      );
      setAssignmentHistory(filtered);
    } catch (error) {
      console.error('Error creating assignment:', error);
      alert('Failed to create assignment.');
      setIsAnimating(false);
    }
  };

  const handleRipple = (e) => {
    const rect = e.target.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setRipple({ x, y });
    setTimeout(() => setRipple(null), 500);
  };

  return (
    <div>
      <Header />
      <div className="assignment-form-wrapper">
        {errorMessage && <p className="error-message">{errorMessage}</p>}

        <div className="assignment-content">
          <form className="assignment-form-container" onSubmit={handleSubmit}>
            <h2 className="assignment-header">Create Assignment</h2>

            <div className="form-field">
              <label htmlFor="classDropdown" className="field-label">Select a Class:</label>
              <select
                id="classDropdown"
                className="class-dropdown"
                value={selectedClassId}
                onChange={(e) => setSelectedClassId(e.target.value)}
                required
              >
                <option value="">Select a class</option>
                {classList.map((classItem) => (
                  <option key={classItem.id} value={classItem.id}>
                    {classItem.className}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-field">
              <label htmlFor="titleInput" className="field-label">Title:</label>
              <input
                type="text"
                id="titleInput"
                className="title-input-field"
                value={assignmentTitle}
                onChange={(e) => setAssignmentTitle(e.target.value)}
                required
              />
            </div>

            <div className="form-field">
              <label htmlFor="descriptionTextarea" className="field-label">Description:</label>
              <textarea
                id="descriptionTextarea"
                className="description-textarea-field"
                value={assignmentDescription}
                onChange={(e) => setAssignmentDescription(e.target.value)}
                required
              />
            </div>

            <div className="form-field">
              <label htmlFor="dueDateInput" className="field-label">Due Date:</label>
              <input
                type="date"
                id="dueDateInput"
                className="due-date-input-field"
                value={assignmentDueDate}
                onChange={(e) => setAssignmentDueDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                required
              />
            </div>

            <div className="form-field">
              <label htmlFor="classroomLinkInput" className="field-label">Classroom Link:</label>
              <input
                type="text"
                id="classroomLinkInput"
                className="classroom-link-input-field"
                value={classroomUrl}
                onChange={(e) => setClassroomUrl(e.target.value)}
                placeholder="Enter Classroom Link"
              />
            </div>

            <button
              type="submit"
              className={`submit-assignment-button ripple-button ${isAnimating ? 'animating' : ''}`}
              onClick={handleRipple}
              disabled={isAnimating}
            >
              Create Assignment
              {ripple && (
                <span
                  className="ripple"
                  style={{
                    left: `${ripple.x}px`,
                    top: `${ripple.y}px`,
                  }}
                />
              )}
            </button>
          </form>

          {/* Assignment History Section */}
          {assignmentHistory.length > 0 && (
            <div className="assignment-history">
              <h3>Assignment History</h3>
              <table className="assignment-table">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Description</th>
                    <th>Due Date</th>
                    <th>Link</th>
                  </tr>
                </thead>
                <tbody>
                  {assignmentHistory.map((assignment) => (
                    <tr key={assignment.id}>
                      <td>{assignment.title}</td>
                      <td>{assignment.description}</td>
                      <td>{assignment.dueDate?.split('T')[0]}</td>
                      <td>
                        {assignment.classroomLink ? (
                          <a href={assignment.classroomLink} target="_blank" rel="noopener noreferrer">
                            Link
                          </a>
                        ) : (
                          'N/A'
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AssignmentPostPage;
