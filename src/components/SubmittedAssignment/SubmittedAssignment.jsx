// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import './SubmittedAssignment.css';

// const SubmittedAssignment = () => {
//   const [classes, setClasses] = useState([]); // State to hold class data
//   const [selectedClassId, setSelectedClassId] = useState(null); // Selected class ID
//   const [assignments, setAssignments] = useState([]); // State for assignments
//   const [error, setError] = useState(null); // State for any fetch errors

//   // Fetch all classes when the component mounts
//   useEffect(() => {
//     const fetchClasses = async () => {
//       try {
//         const response = await axios.get('http://192.168.0.103:3000/class');
//         setClasses(response.data); // Set classes in state
//       } catch (error) {
//         setError('Failed to fetch classes.'); // Set error message
//       }
//     };
//     fetchClasses();
//   }, []);

//   // Fetch assignments based on selected class ID
//   useEffect(() => {
//     if (selectedClassId) {
//       const fetchAssignments = async () => {
//         try {
//           const response = await axios.get(`http://192.168.0.103:3000/assignments/class/${selectedClassId}`);
//           setAssignments(response.data); // Set assignments in state
//         } catch (error) {
//           setError('Failed to fetch assignments for the selected class.');
//         }
//       };
//       fetchAssignments();
//     }
//   }, [selectedClassId]);

//   return (
//     <div className="submitted-assignment">
//       <h1>Submitted Assignments</h1>

//       {error && <p className="error-message">{error}</p>}

//       <label htmlFor="class-select">Select Class:</label>
//       <select
//         id="class-select"
//         value={selectedClassId || ""}
//         onChange={(e) => setSelectedClassId(e.target.value)}
//       >
//         <option value="" disabled>Select a class</option>
//         {classes.map((classItem) => (
//           <option key={classItem.id} value={classItem.id}>
//             {classItem.name || `Class ${classItem.id}`}
//           </option>
//         ))}
//       </select>

//       <div className="assignments">
//         {assignments.length > 0 ? (
//           [...assignments].reverse().map((assignment) => (
//             <div key={assignment.id} className="assignment-card">
//               <div className="left-side">
//                 <h2>{assignment.title}</h2>
//                 <p><strong>Description:</strong> {assignment.description}</p>
//                 <p><strong>Due Date:</strong> {new Date(assignment.dueDate).toLocaleDateString()}</p>
//                 {assignment.classroomLink && (
//                   <p className="classroom-link">
//                     <strong>Classroom Link:</strong> 
//                     <a href={assignment.classroomLink} target="_blank" rel="noopener noreferrer">
//                       Open Link
//                     </a>
//                   </p>
//                 )}
//               </div>

//               <div className="right-side">
//                 <h3>Student Submissions</h3>
//                 {assignment.submissions.length > 0 ? (
//                   assignment.submissions.map((submission) => (
//                     <div key={submission.id} className="submission-card">
//                       <p><strong>Submission Content:</strong> {submission.content}</p>
//                       {submission.classroomLink && (
//                         <p className="submission-link">
//                           <strong>Classroom Link:</strong>
//                           <a href={submission.classroomLink} target="_blank" rel="noopener noreferrer">
//                             Open Link
//                           </a>
//                         </p>
//                       )}
//                       {/* <p className={submission.graded ? "graded" : "graded no"}>
//                         <strong>Graded:</strong> {submission.graded ? 'Yes' : 'No'}
//                       </p> */}
//                     </div>
//                   ))
//                 ) : (
//                   <p>No submissions found for this assignment.</p>
//                 )}
//               </div>
//             </div>
//           ))
//         ) : (
//           <p>No assignments available.</p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default SubmittedAssignment;


import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './SubmittedAssignment.css';

const SubmittedAssignment = () => {
  const [classes, setClasses] = useState([]);
  const [selectedClassId, setSelectedClassId] = useState(null);
  const [assignments, setAssignments] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const response = await axios.get('http://192.168.0.103:3000/class');
        setClasses(response.data); 
      } catch (error) {
        setError('Failed to fetch classes.'); 
      }
    };
    fetchClasses();
  }, []);

  useEffect(() => {
    if (selectedClassId) {
      const fetchAssignments = async () => {
        try {
          const response = await axios.get(`http://192.168.0.103:3000/assignments/class/${selectedClassId}`);
          setAssignments(response.data); 
        } catch (error) {
          setError('Failed to fetch assignments for the selected class.');
        }
      };
      fetchAssignments();
    }
  }, [selectedClassId]);

  return (
    <div className="submitted-assignment">
      <h1>Submitted Assignments</h1>

      {error && <p className="error-message">{error}</p>}

      <label htmlFor="class-select">Select Class:</label>
      <select
        id="class-select"
        value={selectedClassId || ""}
        onChange={(e) => setSelectedClassId(e.target.value)}
      >
        <option value="" disabled>Select a class</option>
        {classes.map((classItem) => (
          <option key={classItem.id} value={classItem.id}>
            {classItem.className || `Class ${classItem.id}`}
          </option>
        ))}
      </select>

      <div className="assignments">
        {assignments.length > 0 ? (
          [...assignments].reverse().map((assignment) => (
            <div key={assignment.id} className="assignment-card">
              <div className="left-side">
                <h2>{assignment.title}</h2>
                <p><strong>Description:</strong> {assignment.description}</p>
                <p><strong>Due Date:</strong> {new Date(assignment.dueDate).toLocaleDateString()}</p>
                {assignment.classroomLink && (
                  <p className="classroom-link">
                    <strong>Classroom Link:</strong> 
                    <a href={assignment.classroomLink} target="_blank" rel="noopener noreferrer">
                      Open Link
                    </a>
                  </p>
                )}
              </div>

              <div className="right-side">
                <h3>Student Submissions</h3>
                {assignment.submissions.length > 0 ? (
                  assignment.submissions.map((submission) => (
                    <div key={submission.id} className="submission-card">
                      <p><strong>Submission Content:</strong> {submission.content}</p>
                      {submission.classroomLink && (
                        <p className="submission-link">
                          <strong>Classroom Link:</strong>
                          <a href={submission.classroomLink} target="_blank" rel="noopener noreferrer">
                            Open Link
                          </a>
                        </p>
                      )}
                      {/* <p className={submission.graded ? "graded" : "graded no"}> 
                        <strong>Graded:</strong> {submission.graded ? 'Yes' : 'No'}
                      </p> */}
                    </div>
                  ))
                ) : (
                  <p>No submissions found for this assignment.</p>
                )}
              </div>
            </div>
          ))
        ) : (
          <p>No assignments available.</p>
        )}
      </div>
    </div>
  );
};

export default SubmittedAssignment;
