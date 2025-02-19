// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import './CreateMeeting.css'; // Custom styles
// import Header from '../Header/Header';

// const CreateMeeting = () => {
//   const [classNames, setClassNames] = useState([]);
//   const [selectedClass, setSelectedClass] = useState("");
//   const [googleMeetLink, setGoogleMeetLink] = useState("");
//   const [meetingTitle, setMeetingTitle] = useState(""); // New state for meeting title
//   const [message, setMessage] = useState("");
//   const [messageType, setMessageType] = useState(""); 
//   const [isLoading, setIsLoading] = useState(true); 
//   const [existingMeetingId, setExistingMeetingId] = useState(null); 

//   useEffect(() => {
//     const fetchClassNames = async () => {
//       try {
//         const response = await axios.get('http://localhost:3000/class');
//         setClassNames(response.data);
//       } catch (error) {
//         console.error('There was an error fetching the class names:', error);
//         setMessageType('error');
//         setMessage("Failed to load class names. Please try again.");
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchClassNames();
//   }, []);

//   useEffect(() => {
//     const fetchExistingMeeting = async () => {
//       if (selectedClass) {
//         try {
//           const response = await axios.get(`http://localhost:3000/meeting/${selectedClass}`);
//           if (response.data) {
//             setExistingMeetingId(response.data.id);
//           } else {
//             setExistingMeetingId(null);
//           }
//         } catch (error) {
//           console.error('Error checking for existing meeting:', error);
//           setExistingMeetingId(null);
//         }
//       }
//     };

//     fetchExistingMeeting();
//   }, [selectedClass]);

//   const handleClassChange = (e) => {
//     setSelectedClass(e.target.value);
//   };

//   const handleGoogleMeetLinkChange = (e) => {
//     setGoogleMeetLink(e.target.value);
//   };

//   const handleMeetingTitleChange = (e) => {
//     setMeetingTitle(e.target.value); // Handle meeting title input change
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     // Validation checks
//     if (!selectedClass || !googleMeetLink || !meetingTitle) {
//       setMessageType('error');
//       setMessage("Please select a class, enter a Google Meet link, and provide a meeting title.");
//       return;
//     }

//     const googleMeetPattern = /^https:\/\/(meet\.google\.com\/[a-z0-9\-]+)/i;
//     if (!googleMeetPattern.test(googleMeetLink)) {
//       setMessageType('error');
//       setMessage("Please enter a valid Google Meet link.");
//       return;
//     }

//     try {
//       let response;
//       if (existingMeetingId) {
//         // Update existing meeting
//         response = await axios.patch(`http://localhost:3000/meeting/${existingMeetingId}`, {
//           googleMeetLink: googleMeetLink,
//           title: meetingTitle, // Include title in the update
//         });
//         setMessageType('success');
//         setMessage("Meeting updated successfully!");
//       } else {
//         // Create new meeting
//         response = await axios.post('http://localhost:3000/meeting', {
//           classId: selectedClass,
//           googleMeetLink: googleMeetLink,
//           title: meetingTitle, // Include title in the creation
//         });
//         setExistingMeetingId(response.data.id);
//         setMessageType('success');
//         setMessage("Meeting created successfully!");
//       }

//       setSelectedClass("");
//       setGoogleMeetLink("");
//       setMeetingTitle(""); // Clear title after submission
//     } catch (error) {
//       setMessageType('error');
//       setMessage("Error creating or updating meeting. Please try again.");
//       console.error("Error:", error);
//     }
//   };

//   return (
//     <div>
//       <Header/>

//       {/* Title Section */}
//       <section className="title-section">
//         <h1 className="title">Create or Update a Virtual Meeting</h1>
//         <p className="subtitle">Select a class and provide a Google Meet link to schedule or update a meeting.</p>
//       </section>

//       <div className="create-meeting-wrapper">
//         <form onSubmit={handleSubmit} className="create-meeting-form">
//           <div className="input-group">
//             <label htmlFor="meetingTitle" className="input-label">Meeting Title</label>
//             <input
//               type="text"
//               id="meetingTitle"
//               value={meetingTitle}
//               onChange={handleMeetingTitleChange}
//               placeholder="Enter meeting title"
//               required
//               className="input-text"
//             />
//           </div>
//           <div className="input-group">
//             <label htmlFor="class-dropdown" className="input-label">Class</label>
//             <select
//               id="class-dropdown"
//               value={selectedClass}
//               onChange={handleClassChange}
//               className="input-select"
//               disabled={isLoading} 
//             >
//               <option value="">Select a class</option>
//               {classNames.map((classItem) => (
//                 <option key={classItem.id} value={classItem.id}>
//                   {classItem.className}
//                 </option>
//               ))}
//             </select>
//             {isLoading && <p className="loading-text">Loading classes...</p>}
//           </div>
//           <div className="input-group">
//             <label htmlFor="googleMeetLink" className="input-label">Google Meet Link</label>
//             <input
//               type="url"
//               id="googleMeetLink"
//               value={googleMeetLink}
//               onChange={handleGoogleMeetLinkChange}
//               placeholder="Enter Google Meet link"
//               required
//               className="input-url"
//             />
//           </div>
//           <button type="submit" className="submit-button">
//             {existingMeetingId ? "Update Meeting" : "Create Meeting"}
//           </button>
//         </form>
//         {message && (
//           <p className={`status-message ${messageType}`}>
//             {message}
//           </p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default CreateMeeting;

import React, { useState, useEffect } from "react";
import axios from "axios";
import './CreateMeeting.css'; // Custom styles
import Header from '../Header/Header';

const CreateMeeting = () => {
  const [classNames, setClassNames] = useState([]); // List of classes
  const [selectedClass, setSelectedClass] = useState(""); // Selected class
  const [googleMeetLink, setGoogleMeetLink] = useState(""); // Google Meet link
  const [meetingTitle, setMeetingTitle] = useState(""); // Meeting title
  const [message, setMessage] = useState(""); // Status message
  const [messageType, setMessageType] = useState(""); // Success/Error status
  const [isLoading, setIsLoading] = useState(true); // Loading state
  const [existingMeetingId, setExistingMeetingId] = useState(null); // Existing meeting ID
  const [meetings, setMeetings] = useState([]); // Store meetings for the selected class

  // Fetch class names for the dropdown
  useEffect(() => {
    const fetchClassNames = async () => {
      try {
        const response = await axios.get('http://localhost:3000/class');
        setClassNames(response.data);
      } catch (error) {
        console.error('Error fetching class names:', error);
        setMessageType('error');
        setMessage("Failed to load class names. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchClassNames();
  }, []);

  // Fetch meeting schedule when class is selected
  useEffect(() => {
    const fetchMeetings = async () => {
      if (selectedClass) {
        try {
          const response = await axios.get(`http://localhost:3000/meeting/${selectedClass}`);
          if (response.data && response.data.length > 0) {
            setMeetings(response.data); // Store meetings for the selected class
          } else {
            setMeetings([]); // Clear meetings if none found
          }
        } catch (error) {
          console.error('Error fetching meetings:', error);
          setMeetings([]); // Clear meetings if an error occurs
        }
      }
    };
    fetchMeetings();
  }, [selectedClass]);

  // Handle class selection change
  const handleClassChange = (e) => {
    setSelectedClass(e.target.value);
  };

  // Handle Google Meet link change
  const handleGoogleMeetLinkChange = (e) => {
    setGoogleMeetLink(e.target.value);
  };

  // Handle meeting title change
  const handleMeetingTitleChange = (e) => {
    setMeetingTitle(e.target.value);
  };

  // Handle meeting creation/update submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation checks
    if (!selectedClass || !googleMeetLink || !meetingTitle) {
      setMessageType('error');
      setMessage("Please select a class, enter a Google Meet link, and provide a meeting title.");
      return;
    }

    const googleMeetPattern = /^https:\/\/(meet\.google\.com\/[a-z0-9\-]+)/i;
    if (!googleMeetPattern.test(googleMeetLink)) {
      setMessageType('error');
      setMessage("Please enter a valid Google Meet link.");
      return;
    }

    try {
      let response;
      if (existingMeetingId) {
        // Update existing meeting
        response = await axios.patch(`http://localhost:3000/meeting/${existingMeetingId}`, {
          googleMeetLink: googleMeetLink,
          title: meetingTitle,
        });
        setMessageType('success');
        setMessage("Meeting updated successfully!");
      } else {
        // Create new meeting
        response = await axios.post('http://localhost:3000/meeting', {
          classId: selectedClass,
          googleMeetLink: googleMeetLink,
          title: meetingTitle,
        });
        setExistingMeetingId(response.data.id);
        setMessageType('success');
        setMessage("Meeting created successfully!");
      }

      // Clear input fields after submission
      setGoogleMeetLink("");
      setMeetingTitle("");
    } catch (error) {
      setMessageType('error');
      setMessage("Error creating or updating meeting. Please try again.");
      console.error("Error:", error);
    }
  };

  return (
    <div>
      <Header />

      {/* Title Section */}
      <section className="title-section">
        <h1 className="title">Create or Update a Virtual Meeting</h1>
        <p className="subtitle">Select a class and provide a Google Meet link to schedule or update a meeting.</p>
      </section>

      <div className="create-meeting-wrapper">
        {/* Class Dropdown */}
        <div className="input-group">
          <label htmlFor="class-dropdown" className="input-label">Select Class</label>
          <select
            id="class-dropdown"
            value={selectedClass}
            onChange={handleClassChange}
            className="input-select"
            disabled={isLoading}
          >
            <option value="">Select a class</option>
            {classNames.map((classItem) => (
              <option key={classItem.id} value={classItem.id}>
                {classItem.className}
              </option>
            ))}
          </select>
          {isLoading && <p className="loading-text">Loading classes...</p>}
        </div>

        {/* Create Meeting Form */}
        {selectedClass && (
          <form onSubmit={handleSubmit} className="create-meeting-form">
            <div className="input-group">
              <label htmlFor="meetingTitle" className="input-label">Meeting Title</label>
              <input
                type="text"
                id="meetingTitle"
                value={meetingTitle}
                onChange={handleMeetingTitleChange}
                placeholder="Enter meeting title"
                required
                className="input-text"
              />
            </div>
            <div className="input-group">
              <label htmlFor="googleMeetLink" className="input-label">Google Meet Link</label>
              <input
                type="url"
                id="googleMeetLink"
                value={googleMeetLink}
                onChange={handleGoogleMeetLinkChange}
                placeholder="Enter Google Meet link"
                required
                className="input-url"
              />
            </div>
            <button type="submit" className="submit-button">
              {existingMeetingId ? "Update Meeting" : "Create Meeting"}
            </button>
          </form>
        )}

        {/* Meeting Schedule Section */}
        <div className="meetings">
          {selectedClass && (
            <div>
              <h3>Meeting Schedules for Class {selectedClass}</h3>
              {meetings.length > 0 ? (
                <div className="meeting-list">
                  {meetings.map((meeting) => (
                    <div key={meeting.id} className="meeting-card">
                      <h4>{meeting.title}</h4>
                      <p><strong>Google Meet Link:</strong> <a href={meeting.googleMeetLink} target="_blank" rel="noopener noreferrer">Join Meeting</a></p>
                    </div>
                  ))}
                </div>
              ) : (
                <p>No meetings available for this class.</p>
              )}
            </div>
          )}
        </div>

        {/* Status message */}
        {message && (
          <p className={`status-message ${messageType}`}>
            {message}
          </p>
        )}
      </div>
    </div>
  );
};

export default CreateMeeting;
