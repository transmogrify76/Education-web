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
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [studentOptions, setStudentOptions] = useState([]); // Options for students (children)
  const [selectedStudent, setSelectedStudent] = useState(null); // Selected student
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
    // Get the token from local storage
    const token = localStorage.getItem('authToken');
    
    if (token) {
      const decodedToken = jwtDecode(token);
      const userIdFromToken = decodedToken.id;

      // If userId in URL doesn't match the one in token, redirect to correct URL
      if (paramUserId && paramUserId !== userIdFromToken.toString()) {
        navigate(`/consent/${userIdFromToken}`);
      }

      setUserId(userIdFromToken);

      // Fetch parent details from API using parent ID
      axios.get(`http://192.168.0.103:3000/parent/${userIdFromToken}`)
        .then(response => {
          const parentData = response.data;
          setParentName(parentData.name); // Set parent's name
          setEmail(parentData.email); // Set parent's email
          setPhone(parentData.phoneNo); // Set parent's phone number

          // If there are children, set the children dropdown options
          if (parentData.students && parentData.students.length > 0) {
            const childrenOptions = parentData.students.map(child => ({
              value: child.id,
              label: child.name,
            }));
            setStudentOptions(childrenOptions);
          }
        })
        .catch(error => {
          console.error('Error fetching parent details:', error);
          alert('Failed to fetch parent details');
        });
    }
  }, [paramUserId, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedStudent) {
      alert('Please select a student.');
      return;
    }

    const consentData = {
      parentName,
      studentName: selectedStudent.label, // Use the selected student's name
      email,
      phone,
      selectedOption: selectedOption.value,
      userId, // Include userId in the consent data
    };

    try {
      await axios.post('http://192.168.0.103:3000/consent', consentData);
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
              readOnly
            />
          </div>
          <div className="form-group">
            <label>Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              readOnly
            />
          </div>
          <div className="form-group">
            <label>Phone Number:</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              readOnly
            />
          </div>
          <div className="form-group">
            <label>Select a Student:</label>
            <Select
              options={studentOptions}
              value={selectedStudent}
              onChange={setSelectedStudent}
              placeholder="Please select a student"
              isSearchable={false}
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
