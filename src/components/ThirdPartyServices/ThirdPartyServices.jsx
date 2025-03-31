import React, { useEffect, useState } from 'react';
import {jwtDecode} from 'jwt-decode'; // Import jwt-decode to decode the token
import './ThirdPartyServices.css';
import Header from '../Header/Header';

const ThirdPartyServices = () => {
  const [formData, setFormData] = useState({
    studentName: '',
    email: '',
    phoneNo: '',
    selectedServices: [],
  });
  const [students, setStudents] = useState([]);
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cachedData, setCachedData] = useState({});

  useEffect(() => {
    const authToken = localStorage.getItem('authToken');
    if (authToken) {
      try {
        // Decode the JWT token to get the parentId
        const decodedToken = jwtDecode(authToken);
        const parentId = decodedToken.id;

        const fetchData = async () => {
          try {
            // Fetch parent data
            const parentResponse = await fetch(`http://192.168.0.103:3000/parent/${parentId}`);
            if (!parentResponse.ok) {
              throw new Error('Network response was not ok');
            }
            const parentData = await parentResponse.json();
            setFormData((prevFormData) => ({
              ...prevFormData,
              email: parentData.email || '',
              phoneNo: parentData.phoneNo || '',
            }));

            // Fetch student names
            const studentResponse = await fetch(`http://192.168.0.103:3000/parent/${parentId}`);
            if (!studentResponse.ok) {
              throw new Error('Network response was not ok');
            }
            const studentData = await studentResponse.json();
            setStudents(studentData.students || []);

            // Fetch existing service requests for caching
            const cachedResponse = await fetch(`http://192.168.0.103:3000/third-party-services?parentId=${parentId}`);
            if (cachedResponse.ok) {
              const cachedData = await cachedResponse.json();
              setCachedData(cachedData);
              setStatus(cachedData.status || '');
            }
          } catch (error) {
            console.error('Error fetching data:', error);
            setError('Failed to fetch data.');
          } finally {
            setLoading(false);
          }
        };

        fetchData();
      } catch (error) {
        console.error('Failed to decode authToken:', error);
        setLoading(false); // Stop loading even if decoding fails
      }
    } else {
      console.error('No authToken found in localStorage');
      setLoading(false); // Stop loading if no token is found
    }
  }, []);

  const handleChange = (e) => {
    const { name, value, checked } = e.target;
    if (name === 'selectedServices') {
      setFormData((prevFormData) => ({
        ...prevFormData,
        selectedServices: checked
          ? [...prevFormData.selectedServices, value]
          : prevFormData.selectedServices.filter((service) => service !== value),
      }));
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://192.168.0.103:3000/third-party-services', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to submit form');
      }

      const result = await response.json();
      setStatus(result.status || '');
      console.log('Form submitted', result);
    } catch (error) {
      console.error('Error submitting form:', error);
      setError('Failed to submit form.');
    }
  };

  if (loading) {
    return <p></p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div>
      <Header />
      <div className="container">
        <h2 className="heading">Third Party Optional Services</h2>
        <form className="form" onSubmit={handleSubmit}>
          <label htmlFor="studentName">Student's Name:</label>
          <select
            name="studentName"
            value={formData.studentName}
            onChange={handleChange}
            className="input"
            required
          >
            <option value="">Select a student</option>
            {students.map((student) => (
              <option key={student.id} value={student.name}>
                {student.name}
              </option>
            ))}
          </select>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            className="input"
            required
          />
          <input
            type="tel"
            name="phoneNo"
            value={formData.phoneNo}
            onChange={handleChange}
            placeholder="Phone Number"
            className="input"
            required
          />

          <div className="services">
            <label className="service-label">Select Services:</label>
            <div className="service-option">
              <input
                type="checkbox"
                name="selectedServices"
                value="Transport Service"
                onChange={handleChange}
                className="checkbox"
              />
              <label>Transport Service</label>
            </div>
            <div className="service-option">
              <input
                type="checkbox"
                name="selectedServices"
                value="Meal Plan"
                onChange={handleChange}
                className="checkbox"
              />
              <label>Meal Plan</label>
            </div>
          </div>

          <button type="submit" className="submit-button">Submit Request</button>
        </form>
        {status && <p className="status-message">Status: {status}</p>}
      </div>
    </div>
  );
};

export default ThirdPartyServices;
