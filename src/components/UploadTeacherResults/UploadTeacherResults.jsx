import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './UploadTeacherResults.css'; // Assuming you'll create a CSS file for styles

const UploadTeacherResults = () => {
  const [classNames, setClassNames] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [students, setStudents] = useState([]);
  const [results, setResults] = useState([]);
  const [subjects, setSubjects] = useState(['Math', 'Science', 'English', 'History', 'Geography', 'Art', 'Physical Education', 'Computer Science']);

  // Fetch class names
  useEffect(() => {
    const fetchClassNames = async () => {
      try {
        const response = await axios.get('http://localhost:3000/class');
        setClassNames(response.data);
      } catch (error) {
        console.error('There was an error fetching the class names:', error);
      }
    };

    fetchClassNames();
  }, []);

  // Fetch students based on selected class
  useEffect(() => {
    const fetchStudents = async () => {
      if (selectedClass) {
        try {
          const response = await axios.get(`http://localhost:3000/class/${selectedClass}`);
          const studentsData = response.data.students || [];
          const sortedStudents = studentsData.sort((a, b) => a.name.localeCompare(b.name));
          setStudents(sortedStudents);
          // Initialize results based on students
          const initialResults = sortedStudents.map(student => ({ studentId: student.id, marks: {} }));
          setResults(initialResults);
        } catch (error) {
          console.error('Error fetching students:', error);
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
    updatedSubjects[index] = value; // Update subject name
    setSubjects(updatedSubjects);
    // No need to add an empty row
  };

  const addSubject = () => {
    const newSubject = prompt("Enter new subject name:");
    if (newSubject && !subjects.includes(newSubject)) {
      setSubjects([...subjects, newSubject]);
      // Add empty marks for existing results for the new subject
      const updatedResults = results.map(result => ({
        ...result,
        marks: { ...result.marks, [newSubject]: '' },
      }));
      setResults(updatedResults);
    } else {
      alert("Subject already exists or invalid.");
    }
  };

  const deleteSubject = (index) => {
    const updatedSubjects = subjects.filter((_, i) => i !== index);
    setSubjects(updatedSubjects);

    // Remove the corresponding marks from results
    const updatedResults = results.map(result => {
      const newMarks = { ...result.marks };
      delete newMarks[subjects[index]]; // Remove the mark for the deleted subject
      return {
        ...result,
        marks: newMarks,
      };
    });
    setResults(updatedResults);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      for (const result of results) {
        for (const subject of subjects) {
          if (result.marks[subject] !== undefined) {
            await axios.post('http://localhost:3000/result/upload', {
              studentId: result.studentId,
              classId: selectedClass,
              subjectName: subject,
              marks: result.marks[subject],
            });
          }
        }
      }
      alert('Results uploaded successfully!');
    } catch (error) {
      console.error('Error uploading results:', error);
    }
  };

  return (
    <div className="upload-container">
      <h2 className="upload-container__heading">Upload Results</h2>
      <form onSubmit={handleSubmit}>
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

        <div className="add-subject">
          <button type="button" onClick={addSubject} className="btn-add-subject">Add Subject</button>
        </div>

        <button type="submit" className="btn-primary">Upload Results</button>
      </form>
    </div>
  );
};

export default UploadTeacherResults;
