// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import './UploadResults.css';
// import Header from '../Header/Header';

// const UploadResults = () => {
//   const [students, setStudents] = useState([]);  // List of students for the selected class
//   const [classNames, setClassNames] = useState([]);  // List of available classes
//   const [subjects, setSubjects] = useState([]);  // Subjects for the selected class
//   const [selectedClass, setSelectedClass] = useState('');  // Selected class ID
//   const [marks, setMarks] = useState({});  // Marks for each student and subject
//   const [loading, setLoading] = useState(false);  // Loading state
//   const [error, setError] = useState(null);  // Error handling

//   // // Fetch class names on initial load
//   useEffect(() => {
//     const fetchClassNames = async () => {
//       setLoading(true);
//       setError(null);
//       try {
//         const response = await axios.get('http://localhost:3000/class');
//         setClassNames(Array.isArray(response.data) ? response.data : []);
//       } catch (error) {
//         setError('Error fetching class names');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchClassNames();
//   }, []);  
//   useEffect(() => {
//     const fetchClassDetails = async () => {
//       if (selectedClass) {
//         setLoading(true);
//         setError(null);
//         try {
//           // Fetch students for the selected class
//           const studentsResponse = await axios.get(`http://localhost:3000/class/${selectedClass}`);
//           const studentsData = Array.isArray(studentsResponse.data.students) ? studentsResponse.data.students : [];
//           const sortedStudents = studentsData.sort((a, b) => a.name.localeCompare(b.name));
//           setStudents(sortedStudents);

//           // Fetch subjects for the selected class
//           const subjectsResponse = await axios.get(`http://localhost:3000/subjects/class/${selectedClass}`);
//           const subjectsData = Array.isArray(subjectsResponse.data) ? subjectsResponse.data : [];
//           setSubjects(subjectsData);

//           // Initialize marks state for each student
//           const initialMarks = sortedStudents.reduce((acc, student) => {
//             acc[student.id] = subjectsData.reduce((subAcc, subject) => {
//               subAcc[subject.id] = ''; // Initialize marks with empty string
//               return subAcc;
//             }, {});
//             return acc;
//           }, {});
//           setMarks(initialMarks);
//         } catch (error) {
//           setError('Error fetching class details (students or subjects)');
//         } finally {
//           setLoading(false);
//         }
//       } else {
//         setStudents([]);
//         setMarks({});
//         setSubjects([]);
//       }
//     };

//     fetchClassDetails();
//   }, [selectedClass]);  // Run when the selected class changes

//   // Handle marks input change
//   const handleMarksChange = (studentId, subjectId, value) => {
//     setMarks(prevMarks => ({
//       ...prevMarks,
//       [studentId]: {
//         ...prevMarks[studentId],
//         [subjectId]: value
//       }
//     }));
//   };

//   // Submit the form to upload results
//   const handleSubmit = async (event) => {
//     event.preventDefault();

//     if (!selectedClass || Object.keys(marks).length === 0) {
//       alert('Please fill out all fields');
//       return;
//     }

//     // Submit results for each student and subject
//     try {
//       for (const studentId in marks) {
//         for (const subjectId in marks[studentId]) {
//           const resultData = {
//             studentId,
//             subjectId,
//             classId: selectedClass,
//             marks: marks[studentId][subjectId],
//           };
          
//           await axios.post('http://localhost:3000/results/create', resultData);
//         }
//       }
//       alert('Results uploaded successfully!');
//     } catch (error) {
//       console.error('Error uploading results:', error);
//       alert('Error uploading results');
//     }
//   };

//   return (
//     <div>
//       <Header />
//       <div className="upload-results-container">
//         <h1>Upload Student Results</h1>

//         {/* Class selection */}
//         <div className="form-group">
//           <label htmlFor="class">Select Class</label>
//           <select
//             id="class"
//             value={selectedClass}
//             onChange={(e) => setSelectedClass(e.target.value)}
//           >
//             <option value="">Select a class</option>
//             {classNames.map((classItem) => (
//               <option key={classItem.id} value={classItem.id}>
//                 {classItem.className}
//               </option>
//             ))}
//           </select>
//         </div>

//         {/* Results Table */}
//         {selectedClass && subjects.length > 0 && (
//           <form onSubmit={handleSubmit}>
//             <div className="table-container">
//               <table className="upload-table">
//                 <thead>
//                   <tr>
//                     <th>Student</th>
//                     {subjects.map((subject) => (
//                       <th key={subject.id}>{subject.name}</th>
//                     ))}
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {students.map((student) => (
//                     <tr key={student.id}>
//                       <td>{student.name}</td>
//                       {subjects.map((subject) => (
//                         <td key={subject.id}>
//                           <input
//                             type="number"
//                             value={marks[student.id]?.[subject.id] || ''}
//                             onChange={(e) => handleMarksChange(student.id, subject.id, e.target.value)}
//                             placeholder="Enter marks"
//                           />
//                         </td>
//                       ))}
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>

//             <button type="submit">Upload Results</button>
//           </form>
//         )}

//         {/* Error and Loading States */}
//         {loading && <p>Loading...</p>}
//         {error && <p>{error}</p>}
//       </div>
//     </div>
//   );
// };

// export default UploadResults;


import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './UploadResults.css';
import Header from '../Header/Header';

const UploadResults = () => {
  const [classNames, setClassNames] = useState([]);  // List of available classes
  const [students, setStudents] = useState([]);  // List of students for the selected class
  const [subjects, setSubjects] = useState([]);  // Subjects for the selected class
  const [selectedClass, setSelectedClass] = useState('');  // Selected class ID
  const [selectedStudent, setSelectedStudent] = useState('');  // Selected student ID
  const [marks, setMarks] = useState({});  // Marks for each student and subject
  const [loading, setLoading] = useState(false);  // Loading state
  const [error, setError] = useState(null);  // Error handling

  // Fetch all classes
  useEffect(() => {
    const fetchClassNames = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get('http://localhost:3000/class');
        setClassNames(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        setError('Error fetching class names');
      } finally {
        setLoading(false);
      }
    };

    fetchClassNames();
  }, []);

  // Fetch students and subjects for the selected class
  useEffect(() => {
    const fetchClassDetails = async () => {
      if (selectedClass) {
        setLoading(true);
        setError(null);
        try {
          // Fetch students for the selected class
          const studentsResponse = await axios.get(`http://localhost:3000/class/${selectedClass}`);
          const studentsData = Array.isArray(studentsResponse.data.students) ? studentsResponse.data.students : [];
          setStudents(studentsData);

          // Fetch subjects for the selected class
          const subjectsResponse = await axios.get(`http://localhost:3000/subjects/class/${selectedClass}`);
          const subjectsData = Array.isArray(subjectsResponse.data) ? subjectsResponse.data : [];
          setSubjects(subjectsData);

          // Initialize marks state for each student
          const initialMarks = studentsData.reduce((acc, student) => {
            acc[student.id] = subjectsData.reduce((subAcc, subject) => {
              subAcc[subject.id] = ''; // Initialize marks with empty string
              return subAcc;
            }, {});
            return acc;
          }, {});
          setMarks(initialMarks);
        } catch (error) {
          setError('Error fetching class details (students or subjects)');
        } finally {
          setLoading(false);
        }
      } else {
        setStudents([]);
        setMarks({});
        setSubjects([]);
      }
    };

    fetchClassDetails();
  }, [selectedClass]);  // Run when the selected class changes

  // Handle marks input change
  const handleMarksChange = (studentId, subjectId, value) => {
    setMarks(prevMarks => ({
      ...prevMarks,
      [studentId]: {
        ...prevMarks[studentId],
        [subjectId]: value
      }
    }));
  };

  // Handle student selection
  const handleStudentSelect = (studentId) => {
    setSelectedStudent(studentId);
  };

  // Submit the form to upload results
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!selectedClass || Object.keys(marks).length === 0) {
      alert('Please fill out all fields');
      return;
    }

    // Submit results for each student and subject
    try {
      for (const studentId in marks) {
        for (const subjectId in marks[studentId]) {
          const resultData = {
            studentId,
            subjectId,
            classId: selectedClass,
            marks: marks[studentId][subjectId],
          };
          
          await axios.post('http://localhost:3000/results/create', resultData);
        }
      }
      alert('Results uploaded successfully!');
    } catch (error) {
      console.error('Error uploading results:', error);
      alert('Error uploading results');
    }
  };

  return (
    <div>
      <Header />
      <div className="upload-results-container">
        <h1>Upload Student Results</h1>

        {/* Class selection */}
        <div className="form-group">
          <label htmlFor="class">Select Class</label>
          <select
            id="class"
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
          >
            <option value="">Select a class</option>
            {classNames.map((classItem) => (
              <option key={classItem.id} value={classItem.id}>
                {classItem.className}
              </option>
            ))}
          </select>
        </div>

        {/* Student selection for the selected class */}
        {selectedClass && (
          <div className="form-group">
            <label htmlFor="student">Select Student</label>
            <select
              id="student"
              value={selectedStudent}
              onChange={(e) => handleStudentSelect(e.target.value)}
            >
              <option value="">Select a student</option>
              {students.map((student) => (
                <option key={student.id} value={student.id}>
                  {student.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Subject selection for the selected class */}
        {selectedClass && (
          <div className="form-group">
            <label htmlFor="subject">Select Subject</label>
            <select id="subject">
              <option value="">Select a subject</option>
              {subjects.map((subject) => (
                <option key={subject.id} value={subject.id}>
                  {subject.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Results Table */}
        {selectedClass && selectedStudent && subjects.length > 0 && (
          <form onSubmit={handleSubmit}>
            <div className="table-container">
              <table className="upload-table">
                <thead>
                  <tr>
                    <th>Student</th>
                    {subjects.map((subject) => (
                      <th key={subject.id}>{subject.name}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {students.map((student) => (
                    <tr key={student.id}>
                      <td>{student.name}</td>
                      {subjects.map((subject) => (
                        <td key={subject.id}>
                          <input
                            type="number"
                            value={marks[student.id]?.[subject.id] || ''}
                            onChange={(e) => handleMarksChange(student.id, subject.id, e.target.value)}
                            placeholder="Enter marks"
                          />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <button type="submit">Upload Results</button>
          </form>
        )}

        {/* Error and Loading States */}
        {loading && <p>Loading...</p>}
        {error && <p>{error}</p>}
      </div>
    </div>
  );
};

export default UploadResults;
