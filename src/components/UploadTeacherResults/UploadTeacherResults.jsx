import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './UploadTeacherResults.css';

const UploadTeacherResults = () => {
  const [classNames, setClassNames] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [students, setStudents] = useState([]);
  const [results, setResults] = useState([]);
  const [subjects, setSubjects] = useState(['Math', 'Science', 'English', 'History', 'Geography', 'Art', 'Physical Education', 'Computer Science']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch class names
  useEffect(() => {
    const fetchClassNames = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get('http://192.168.0.103:3000/class');
        setClassNames(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        setError('Error fetching class names');
      } finally {
        setLoading(false);
      }
    };

    fetchClassNames();
  }, []);

  // Fetch students based on selected class
  useEffect(() => {
    const fetchStudents = async () => {
      if (selectedClass) {
        setLoading(true);
        setError(null);
        try {
          const response = await axios.get(`http://192.168.0.103:3000/class/${selectedClass}`);
          const studentsData = Array.isArray(response.data.students) ? response.data.students : [];
          const sortedStudents = studentsData.sort((a, b) => a.name.localeCompare(b.name));
          setStudents(sortedStudents);
          const initialResults = sortedStudents.map(student => ({ studentId: student.id, marks: {} }));
          setResults(initialResults);
        } catch (error) {
          setError('Error fetching students');
        } finally {
          setLoading(false);
        }
      } else {
        setStudents([]);
        setResults([]);
      }
    };

    fetchStudents();
  }, [selectedClass]);

  const handleClassChange = (e) => {
    setSelectedClass(e.target.value);
  };

  const handleResultChange = (index, subject, value) => {
    const updatedResults = [...results];
    updatedResults[index].marks[subject] = value;
    setResults(updatedResults);
  };

  const handleSubjectChange = (index, value) => {
    const updatedSubjects = [...subjects];
    updatedSubjects[index] = value;
    setSubjects(updatedSubjects);

    const updatedResults = results.map((result, idx) => {
      if (idx === index) {
        const updatedMarks = { ...result.marks };
        updatedMarks[value] = updatedMarks[subjects[index]]; // Retain marks from the old subject name
        delete updatedMarks[subjects[index]]; // Remove the old subject
        return { ...result, marks: updatedMarks };
      }
      return result;
    });

    setResults(updatedResults);
  };

  const addSubject = () => {
    const newSubject = prompt('Enter new subject name:');
    if (newSubject && !subjects.includes(newSubject)) {
      setSubjects([...subjects, newSubject]);
      const updatedResults = results.map(result => ({
        ...result,
        marks: { ...result.marks, [newSubject]: '' },
      }));
      setResults(updatedResults);
    } else {
      alert('Subject already exists or is invalid.');
    }
  };

  const deleteSubject = (index) => {
    const updatedSubjects = subjects.filter((_, i) => i !== index);
    setSubjects(updatedSubjects);

    const updatedResults = results.map(result => {
      const newMarks = { ...result.marks };
      delete newMarks[subjects[index]];
      return { ...result, marks: newMarks };
    });
    setResults(updatedResults);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      // Prepare the results for backend
      const payload = results.map(result => ({
        studentId: result.studentId,
        year: new Date().getFullYear(), // assuming current year for now
        subjects: Object.keys(result.marks).map(subjectName => ({
          subjectName,
          marks: result.marks[subjectName],
        })),
      }));

      // POST request to upload results
      for (const data of payload) {
        await axios.post('http://192.168.0.103:3000/result/upload', data);
      }
      
      alert('Results uploaded successfully!');
    } catch (error) {
      setError('Error uploading results');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="upload-container">
      <h2 className="upload-container__heading">Upload Results</h2>
      <form onSubmit={handleSubmit}>
        {loading && <div className="loading"></div>}
        {error && <div className="error-message">{error}</div>}

        <div className="form-group">
          <label htmlFor="class-dropdown" className="form-group__label">Select Class:</label>
          <select
            id="class-dropdown"
            value={selectedClass}
            onChange={handleClassChange}
            className="form-group__select"
          >
            <option value="">Select a class</option>
            {classNames.map((classItem) => (
              <option key={classItem.id} value={classItem.id}>
                {classItem.className}
              </option>
            ))}
          </select>
        </div>

        {students.length > 0 && (
          <table className="results-table">
            <thead>
              <tr>
                <th>Student Name</th>
                {subjects.map((subject, index) => (
                  <th key={subject}>
                    <input
                      type="text"
                      value={subject}
                      onChange={(e) => handleSubjectChange(index, e.target.value)}
                      className="form-group__input"
                    />
                    <button type="button" onClick={() => deleteSubject(index)} className="btn-delete">Delete</button>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {results.map((result, index) => (
                <tr key={index}>
                  <td>
                    {students[index] ? (
                      <span>{students[index].name}</span>
                    ) : (
                      <span>No student</span>
                    )}
                  </td>
                  {subjects.map((subject) => (
                    <td key={subject}>
                      <input
                        type="number"
                        value={result.marks[subject] || ''}
                        onChange={(e) => handleResultChange(index, subject, e.target.value)}
                        placeholder={`Marks for ${subject}`}
                        className="form-group__input"
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        )}

        <div className="add-subject">
          <button type="button" onClick={addSubject} className="btn-add-subject">Add Subject</button>
        </div>

        <button type="submit" className="btn-primary" disabled={loading}>Upload Results</button>
      </form>
    </div>
  );
};

export default UploadTeacherResults;
