

// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { useParams } from 'react-router-dom';
// import Header from '../Header/Header';

// const CommunicationPage = () => {
//     const { teacherId } = useParams(); // Access route parameter here
//     const [recipientType, setRecipientType] = useState('student');
//     const [recipients, setRecipients] = useState([]); // Store students or parents
//     const [title, setTitle] = useState('');
//     const [content, setContent] = useState('');
//     const [recipientId, setRecipientId] = useState('');
//     const [selectedClass, setSelectedClass] = useState('');
//     const [classes, setClasses] = useState([]); // Store available classes
//     const [parentInfo, setParentInfo] = useState(null); // Store parent information when student is selected

//     const token = localStorage.getItem('authToken'); // Assuming the auth token is stored in local storage

//     // Fetch available classes
//     useEffect(() => {
//         axios.get('http://localhost:3000/class', {
//             headers: { Authorization: `Bearer ${token}` }
//         })
//         .then(response => setClasses(response.data))
//         .catch(error => console.error('Error fetching classes:', error));
//     }, [token]);

//     // Fetch students for a specific class
//     const fetchStudentsForClass = async (classId) => {
//         try {
//             const response = await axios.get(`http://localhost:3000/class/${classId}`, {
//                 headers: { Authorization: `Bearer ${token}` }
//             });

//             // Map the students to include their parent's name along with the student's info
//             const studentsWithParents = response.data.students.map(student => ({
//                 ...student,
//                 parentName: student.parent ? student.parent.name : 'N/A' // Add parent's name
//             }));

//             setRecipients(studentsWithParents); // Set students along with parent names
//         } catch (error) {
//             console.error('Error fetching students for class:', error);
//         }
//     };

//     // Fetch students when class is selected
//     useEffect(() => {
//         if (selectedClass) {
//             fetchStudentsForClass(selectedClass); // Fetch students for the selected class
//         } else {
//             setRecipients([]); // Clear recipients if no class is selected
//         }
//     }, [selectedClass]);

//     // Handle recipient selection (whether student or parent)
//     const handleRecipientChange = (e) => {
//         const selectedRecipient = e.target.value;
//         setRecipientId(selectedRecipient);

//         // If student is selected, fetch parent info
//         if (recipientType === 'student') {
//             const selectedStudent = recipients.find(student => student.id === selectedRecipient);
//             if (selectedStudent) {
//                 setParentInfo(selectedStudent.parent); // Store parent info
//             }
//         }
//     };

//     // Handle sending the communication (without the selected class)
//     const handleSendCommunication = () => {
//         const communicationData = {
//             title,
//             content,
//             recipientType,
//             recipientId,
//             // Do not include selectedClass in the payload here
//         };

//         axios.post(`http://localhost:3000/communication/send-communication/${teacherId}`, communicationData)
//             .then(response => alert('Communication sent successfully!'))
//             .catch(error => console.error('Error sending communication:', error));
//     };

//     return (
//         <div>
//             <Header />
//             <div className="communication-container">
//                 <h1>Create Communication</h1>
//                 <form onSubmit={(e) => e.preventDefault()}>
//                     <div>
//                         <label>Recipient Type:</label>
//                         <select value={recipientType} onChange={(e) => setRecipientType(e.target.value)}>
//                             <option value="student">Student</option>
//                             <option value="parent">Parent</option>
//                         </select>
//                     </div>
//                     <div>
//                         <label>Title:</label>
//                         <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
//                     </div>
//                     <div>
//                         <label>Content:</label>
//                         <textarea value={content} onChange={(e) => setContent(e.target.value)} />
//                     </div>

//                     <div>
//                         <label>Select Class (Frontend Only):</label>
//                         <select value={selectedClass} onChange={(e) => setSelectedClass(e.target.value)}>
//                             <option value="">Select Class...</option>
//                             {classes.map((classItem) => (
//                                 <option key={classItem.id} value={classItem.id}>
//                                     {classItem.className}
//                                 </option>
//                             ))}
//                         </select>
//                     </div>

//                     <div>
//                         <label>Select Recipient:</label>
//                         <select value={recipientId} onChange={handleRecipientChange}>
//                             <option value="">Select...</option>
//                             {recipients.length > 0 ? (
//                                 recipients.map((recipient) => (
//                                     recipientType === 'student' ? (
//                                         <option key={recipient.id} value={recipient.id}>
//                                             {recipient.name} {/* Display student name */}
//                                         </option>
//                                     ) : (
//                                         // If recipient type is 'parent', display both parent and student names
//                                         <option key={recipient.id} value={recipient.id}>
//                                             {recipient.parentName} - {recipient.name} {/* Display parent and student names */}
//                                         </option>
//                                     )
//                                 ))
//                             ) : (
//                                 <option value="">No recipients available</option>
//                             )}
//                         </select>
//                     </div>

//                     {recipientType === 'student' && parentInfo && (
//                         <div>
//                             <label>Parent: </label>
//                             <input type="text" value={parentInfo.name} readOnly />
//                         </div>
//                     )}

//                     <button type="button" onClick={handleSendCommunication}>Send Communication</button>
//                 </form>
//             </div>
//         </div>
//     );
// };

// export default CommunicationPage;
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Header from '../Header/Header';

const CommunicationPage = () => {
    const { teacherId } = useParams(); // Access route parameter here
    const [recipientType, setRecipientType] = useState('student');
    const [recipients, setRecipients] = useState([]); // Store students or parents
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [recipientId, setRecipientId] = useState('');
    const [selectedClass, setSelectedClass] = useState('');
    const [classes, setClasses] = useState([]); // Store available classes
    const [parentInfo, setParentInfo] = useState(null); // Store parent information when student is selected

    const token = localStorage.getItem('authToken'); // Assuming the auth token is stored in local storage

    // Fetch available classes
    useEffect(() => {
        axios.get('http://localhost:3000/class', {
            headers: { Authorization: `Bearer ${token}` }
        })
        .then(response => setClasses(response.data))
        .catch(error => console.error('Error fetching classes:', error));
    }, [token]);

    // Fetch students for a specific class
    const fetchStudentsForClass = async (classId) => {
        try {
            const response = await axios.get(`http://localhost:3000/class/${classId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            // Map the students to include their parent's name along with the student's info
            const studentsWithParents = response.data.students.map(student => ({
                ...student,
                parentName: student.parent ? student.parent.name : 'N/A', // Add parent's name
                parentId: student.parent ? student.parent.id : null // Add parent's ID if available
            }));

            setRecipients(studentsWithParents); // Set students along with parent names
        } catch (error) {
            console.error('Error fetching students for class:', error);
        }
    };

    // Fetch students when class is selected
    useEffect(() => {
        if (selectedClass) {
            fetchStudentsForClass(selectedClass); // Fetch students for the selected class
        } else {
            setRecipients([]); // Clear recipients if no class is selected
        }
    }, [selectedClass]);

    // Handle recipient selection (whether student or parent)
    const handleRecipientChange = (e) => {
        const selectedRecipient = e.target.value;
        setRecipientId(selectedRecipient);

        // If recipient type is 'student'
        if (recipientType === 'student') {
            const selectedStudent = recipients.find(student => student.id === selectedRecipient);
            if (selectedStudent) {
                setParentInfo(selectedStudent.parent || null); // Set parent info if available
            }
        } else if (recipientType === 'parent') {
            // If recipient type is 'parent', ensure we're selecting the correct parent
            const selectedParent = recipients.find(student => student.parentId && student.parentId === selectedRecipient);
            if (selectedParent) {
                setRecipientId(selectedParent.parentId); // Set recipientId to the parent's ID
            }
        }
    };

    // Handle sending the communication (without the selected class)
    const handleSendCommunication = () => {
        const communicationData = {
            title,
            content,
            recipientType,
            recipientId,
            // Do not include selectedClass in the payload here
        };

        axios.post(`http://localhost:3000/communication/send-communication/${teacherId}`, communicationData)
            .then(response => alert('Communication sent successfully!'))
            .catch(error => console.error('Error sending communication:', error));
    };

    return (
        <div>
            <Header />
            <div className="communication-container">
                <h1>Create Communication</h1>
                <form onSubmit={(e) => e.preventDefault()}>
                    <div>
                        <label>Recipient Type:</label>
                        <select value={recipientType} onChange={(e) => setRecipientType(e.target.value)}>
                            <option value="student">Student</option>
                            <option value="parent">Parent</option>
                        </select>
                    </div>
                    <div>
                        <label>Title:</label>
                        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
                    </div>
                    <div>
                        <label>Content:</label>
                        <textarea value={content} onChange={(e) => setContent(e.target.value)} />
                    </div>

                    <div>
                        <label>Select Class (Frontend Only):</label>
                        <select value={selectedClass} onChange={(e) => setSelectedClass(e.target.value)}>
                            <option value="">Select Class...</option>
                            {classes.map((classItem) => (
                                <option key={classItem.id} value={classItem.id}>
                                    {classItem.className}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label>Select Recipient:</label>
                        <select value={recipientId} onChange={handleRecipientChange}>
                            <option value="">Select...</option>
                            {recipients.length > 0 ? (
                                recipients.map((recipient) => (
                                    recipientType === 'student' ? (
                                        <option key={recipient.id} value={recipient.id}>
                                            {recipient.name} {/* Display student name */}
                                        </option>
                                    ) : (
                                        // If recipient type is 'parent', display both parent and student names
                                        recipient.parentId && (
                                            <option key={recipient.parentId} value={recipient.parentId}>
                                                {recipient.parentName} - {recipient.name} {/* Display parent and student names */}
                                            </option>
                                        )
                                    )
                                ))
                            ) : (
                                <option value="">No recipients available</option>
                            )}
                        </select>
                    </div>

                    {recipientType === 'student' && parentInfo && (
                        <div>
                            <label>Parent: </label>
                            <input type="text" value={parentInfo.name} readOnly />
                        </div>
                    )}

                    <button type="button" onClick={handleSendCommunication}>Send Communication</button>
                </form>
            </div>
        </div>
    );
};

export default CommunicationPage;
