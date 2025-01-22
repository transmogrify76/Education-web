// import React, { useState } from 'react';
// import Select from 'react-select';
// import axios from 'axios';
// import './Consent.css';
// import Header from '../Header/Header';

// const Consent = () => {
//   const options = [
//     { value: 'I am giving consent for option 1', label: 'Option 1' },
//     { value: 'I am giving consent for option2', label: 'Option 2' },
//     { value: 'I am giving consent for option3', label: 'Option 3' },
//   ];

//   const [selectedOption, setSelectedOption] = useState(null);
//   const [parentName, setParentName] = useState('');
//   const [studentName, setStudentName] = useState('');
//   const [email, setEmail] = useState('');
//   const [phone, setPhone] = useState('');

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const consentData = {
//       parentName,
//       studentName,
//       email,
//       phone,
//       selectedOption: selectedOption.value,
//     };

//     try {
//       await axios.post('http://localhost:3000/consent', consentData);
//       alert('Consent form submitted successfully!');
//     } catch (error) {
//       console.error('Error submitting consent form:', error);
//       alert('Failed to submit consent form');
//     }
//   };

//   return (
//     <div>
//       <Header/>

//     <div className="consent-form">
//       <h2 className="head">Consent Form</h2>
//       <p className="para">
//         Dear Parent, for the information in the dropdown below, we require your consent.
//       </p>
//       <form onSubmit={handleSubmit} className="container">
//         <div className="form-group">
//           <label>Parent's Name:</label>
//           <input
//             type="text"
//             value={parentName}
//             onChange={(e) => setParentName(e.target.value)}
//             required
//           />
//         </div>
//         <div className="form-group">
//           <label>Student's Name:</label>
//           <input
//             type="text"
//             value={studentName}
//             onChange={(e) => setStudentName(e.target.value)}
//             required
//           />
//         </div>
//         <div className="form-group">
//           <label>Email:</label>
//           <input
//             type="email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             required
//           />
//         </div>
//         <div className="form-group">
//           <label>Phone Number:</label>
//           <input
//             type="tel"
//             value={phone}
//             onChange={(e) => setPhone(e.target.value)}
//             required
//           />
//         </div>
//         <div className="form-group">
//           <label>Select an Option:</label>
//           <Select
//             options={options}
//             value={selectedOption}
//             onChange={setSelectedOption}
//             placeholder="Please select"
//             isSearchable={false}
//             required
//           />
//         </div>
//         <button type="submit" className="submit-btn">Submit</button>
//       </form>
//     </div>
//     </div>
//   );
// };

// export default Consent;


import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Select from 'react-select';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode'; // Correct import
import './Consent.css';
import Header from '../Header/Header';

const Consent = () => {
  // Define state variables
  const [selectedOption, setSelectedOption] = useState(null);
  const [parentName, setParentName] = useState('');
  const [studentName, setStudentName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [userId, setUserId] = useState(null); // Define userId state
  const navigate = useNavigate(); // Hook to navigate programmatically

  // Get userId from URL params
  const { userId: paramUserId } = useParams(); // This will get the userId from the URL

  const options = [
    { value: 'I give consent for field trips', label: 'Field Trips' },
    { value: 'I give consent for extracurricular activities', label: 'Extracurricular Activities' },
    { value: 'I give consent for photography use', label: 'Photography Use' },
  ];

  useEffect(() => {
    // Get the token from local storage (or from where it's stored)
    const token = localStorage.getItem('authToken');

    if (token) {
      const decodedToken = jwtDecode(token); // Use jwtDecode function
      const userIdFromToken = decodedToken.userId; // Decode to get the userId from the token

      // If userId in URL doesn't match the one in token, redirect to correct URL
      if (paramUserId && paramUserId !== userIdFromToken.toString()) {
        navigate(`/consent/${userIdFromToken}`);
      }

      setUserId(userIdFromToken); // Set userId state from decoded token
    }
  }, [paramUserId, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const consentData = {
      parentName,
      studentName,
      email,
      phone,
      selectedOption: selectedOption.value,
      userId, // Include userId in the consent data
    };

    try {
      await axios.post('http://localhost:3000/consent', consentData);
      alert('Consent form submitted successfully!');
    } catch (error) {
      console.error('Error submitting consent form:', error);
      alert('Failed to submit consent form');
    }
  };

  return (
    <div>
      <Header />
      <div className="consent-form">
        <h2 className="head">Consent Form</h2>
        <p className="para">
          Dear Parent, for the information in the dropdown below, we require your consent.
        </p>
        <form onSubmit={handleSubmit} className="container">
          <div className="form-group">
            <label>Parent's Name:</label>
            <input
              type="text"
              value={parentName}
              onChange={(e) => setParentName(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Student's Name:</label>
            <input
              type="text"
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Phone Number:</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Select an Option:</label>
            <Select
              options={options}
              value={selectedOption}
              onChange={setSelectedOption}
              placeholder="Please select"
              isSearchable={false}
              required
            />
          </div>
          <button type="submit" className="submit-btn">Submit</button>
        </form>
      </div>
    </div>
  );
};

export default Consent;
