import React, { useState, useEffect } from 'react';
import Header from '../Header/Header';
import { useParams } from 'react-router-dom';
import SideNav from '../SideNav/SideNav';

const SubjectEdit = () => {
  const { studentId } = useParams();
  const [classes, setClasses] = useState([]);  
  const [selectedClass, setSelectedClass] = useState('');
  const [subjectName, setSubjectName] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        setLoading(true); 
        const response = await fetch('http://192.168.0.103:3000/class');
        const data = await response.json();
        if (Array.isArray(data)) {
          setClasses(data);
        } else {
          setMessage('Error: Classes data is not in the expected format.');
        }
      } catch (error) {
        console.error('Error fetching classes:', error);
        setMessage('Error fetching classes. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchClasses();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedClass || !subjectName) {
      setMessage('Please fill in all fields.');
      return;
    }

    try {
      const response = await fetch('http://192.168.0.103:3000/subjects/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: subjectName,
          classId: parseInt(selectedClass),
        }),
      });

      if (response.ok) {
        setMessage('Subject added successfully!');
        setSubjectName('');
        setSelectedClass('');
      } else {
        const data = await response.json();
        setMessage(`Error: ${data.message || 'Something went wrong'}`);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setMessage('Error submitting the form. Please try again.');
    }
  };

  return (
    <div className="subject-edit-page">
      <Header />
      <SideNav studentId={studentId} />
      <h1>Add Subject to Class</h1>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="classSelect">Select Class</label>
            <select
              id="classSelect"
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              required
            >
              <option value="">Select a class</option>
              {Array.isArray(classes) && classes.length > 0 ? (
                classes.map((cls) => (
                  <option key={cls.id} value={cls.id}>
                    {cls.className}
                  </option>
                ))
              ) : (
                <option disabled>No classes available</option>
              )}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="subjectName">Subject Name</label>
            <input
              type="text"
              id="subjectName"
              value={subjectName}
              onChange={(e) => setSubjectName(e.target.value)}
              placeholder="Enter subject name"
              required
            />
          </div>

          <button type="submit">Add Subject</button>
        </form>
      )}

      {message && <div className="message">{message}</div>}
    </div>
  );
};

export default SubjectEdit;
