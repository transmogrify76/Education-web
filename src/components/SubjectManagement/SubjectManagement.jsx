import React, { useState, useEffect } from 'react';
import Header from '../Header/Header';
import { useParams } from 'react-router-dom';
import './SubjectManagement.css';

const SubjectManagementPage = () => {
  const { studentId } = useParams();
  const [classOptions, setClassOptions] = useState([]);
  const [selectedClassOption, setSelectedClassOption] = useState('');
  const [subjectTitle, setSubjectTitle] = useState('');
  const [notification, setNotification] = useState('');
  const [classSubjects, setClassSubjects] = useState([]);
  const [editingSubject, setEditingSubject] = useState(null);
  const [newSubjectName, setNewSubjectName] = useState('');

  useEffect(() => {
    const fetchClassOptions = async () => {
      try {
        const response = await fetch('http://192.168.0.103:3000/class');
        const data = await response.json();
        if (Array.isArray(data)) {
          setClassOptions(data);
        } else {
          setNotification('Error: Classes data is not in the expected format.');
        }
      } catch (error) {
        console.error('Error fetching classes:', error);
        setNotification('Error fetching classes. Please try again later.');
      }
    };
    fetchClassOptions();
  }, []);

  useEffect(() => {
    const fetchClassSubjects = async () => {
      if (selectedClassOption) {
        try {
          const response = await fetch(`http://192.168.0.103:3000/subjects/class/${selectedClassOption}`);
          const data = await response.json();
          if (Array.isArray(data)) {
            setClassSubjects(data);
          } else {
            setNotification('Error: Subjects data is not in the expected format.');
          }
        } catch (error) {
          console.error('Error fetching subjects:', error);
          setNotification('Error fetching subjects. Please try again later.');
        }
      } else {
        setClassSubjects([]);
      }
    };
    fetchClassSubjects();
  }, [selectedClassOption]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedClassOption || !subjectTitle) {
      setNotification('Please fill in all fields.');
      return;
    }

    try {
      const response = await fetch('http://192.168.0.103:3000/subjects/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: subjectTitle,
          classId: parseInt(selectedClassOption),
        }),
      });

      if (response.ok) {
        const newSubject = await response.json();
        setClassSubjects((prevSubjects) => [...prevSubjects, newSubject]);
        setNotification('Subject added successfully!');
        setSubjectTitle('');
      } else {
        const data = await response.json();
        setNotification(`Error: ${data.message || 'Something went wrong'}`);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setNotification('Error submitting the form. Please try again.');
    }
  };

  const handleDeleteSubject = async (classId, subjectId) => {
    try {
      const response = await fetch(`http://192.168.0.103:3000/subjects/class/${classId}/subject/${subjectId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setClassSubjects((prevSubjects) => prevSubjects.filter(subject => subject.id !== subjectId));
        setNotification('Subject deleted successfully!');
      } else {
        const data = await response.json();
        setNotification(`Error: ${data.message || 'Something went wrong'}`);
      }
    } catch (error) {
      console.error('Error deleting subject:', error);
      setNotification('Error deleting the subject. Please try again.');
    }
  };

  const handleUpdateSubject = async (classId, subjectId) => {
    try {
      const response = await fetch(`http://192.168.0.103:3000/subjects/class/${classId}/subject/${subjectId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: newSubjectName,
        }),
      });

      if (response.ok) {
        const updatedSubject = await response.json();
        setClassSubjects((prevSubjects) => prevSubjects.map(subject => subject.id === subjectId ? updatedSubject : subject));
        setNotification('Subject updated successfully!');
        setEditingSubject(null);
        setNewSubjectName('');
      } else {
        const data = await response.json();
        setNotification(`Error: ${data.message || 'Something went wrong'}`);
      }
    } catch (error) {
      console.error('Error updating subject:', error);
      setNotification('Error updating the subject. Please try again.');
    }
  };

  const handleEditSubject = (subject) => {
    setEditingSubject(subject);
    setNewSubjectName(subject.name);
  };

  return (
    <div className="subject-management-container">
      <Header />
      <div className="subject-management-content-one">
        <h1 className="heading-main">Add Subject to Class</h1>

        <form onSubmit={handleSubmit} className="subject-form">
          <div className="form-field-one">
            <label htmlFor="classSelect">Select Class</label>
            <select
              id="classSelect"
              value={selectedClassOption}
              onChange={(e) => setSelectedClassOption(e.target.value)}
              required
            >
              <option value="">Select a class</option>
              {classOptions.map((cls) => (
                <option key={cls.id} value={cls.id}>
                  {cls.className}
                </option>
              ))}
            </select>
          </div>

          <div className="form-field-one">
            <label htmlFor="subjectName">Subject Name</label>
            <input
              type="text"
              id="subjectName"
              value={subjectTitle}
              onChange={(e) => setSubjectTitle(e.target.value)}
              placeholder="Enter subject name"
              required
            />
          </div>

          <div className="submit-div" onClick={handleSubmit}>Add Subject</div>
        </form>

        {notification && <div className="notification-banner">{notification}</div>}

        <div className="subject-list-container">
          {selectedClassOption && (
            <>
              <h2>Subjects in this Class</h2>
              <div className="subject-cards-container">
                {classSubjects.length > 0 ? (
                  classSubjects.map((subject) => (
                    <div key={subject.id} className="subject-card">
                      {editingSubject && editingSubject.id === subject.id ? (
                        <div className="subject-edit-form">
                          <input
                            type="text"
                            value={newSubjectName}
                            onChange={(e) => setNewSubjectName(e.target.value)}
                          />
                          <div className="submit-div" onClick={() => handleUpdateSubject(selectedClassOption, subject.id)}>
                            Update
                          </div>
                        </div>
                      ) : (
                        <>
                          <h3>{subject.name}</h3>
                          <div className="subject-actions-container">
                            <div onClick={() => handleEditSubject(subject)} className="edit-div">Edit</div>
                            <div onClick={() => handleDeleteSubject(selectedClassOption, subject.id)} className="delete-div">Delete</div>
                          </div>
                        </>
                      )}
                    </div>
                  ))
                ) : (
                  <p>No subjects available for this class.</p>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SubjectManagementPage;
