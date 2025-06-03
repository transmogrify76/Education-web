import React, { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
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
  const [previousRequests, setPreviousRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [parentId, setParentId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedYear, setSelectedYear] = useState('');

  useEffect(() => {
    const authToken = localStorage.getItem('authToken');
    if (authToken) {
      try {
        const decodedToken = jwtDecode(authToken);
        const parentId = decodedToken.id;
        setParentId(parentId);

        const fetchData = async () => {
          try {
            const response = await fetch(`http://192.168.0.103:3000/parent/${parentId}`);
            const data = await response.json();

            setFormData((prev) => ({
              ...prev,
              email: data.email || '',
              phoneNo: data.phoneNo || '',
            }));
            setStudents(data.students || []);
          } catch (err) {
            console.error(err);
            setError('Failed to fetch parent/students data.');
          } finally {
            setLoading(false);
          }
        };

        fetchData();
      } catch (err) {
        console.error('Failed to decode auth token:', err);
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, []);

  const handleChange = (e) => {
    const { name, value, checked } = e.target;
    if (name === 'selectedServices') {
      setFormData((prevFormData) => ({
        ...prevFormData,
        selectedServices: checked
          ? [...prevFormData.selectedServices, value]
          : prevFormData.selectedServices.filter((s) => s !== value),
      }));
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://192.168.0.103:3000/third-party-services', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Submission failed');

      const result = await response.json();
      setStatus(result.status || '');
    } catch (err) {
      console.error('Submit error:', err);
      setError('Failed to submit request.');
    }
  };

  const handleFilter = async () => {
    if (!parentId || !selectedMonth || !selectedYear) return;

    try {
      const url = `http://192.168.0.103:3000/third-party-services/for-parent?parentId=${parentId}&month=${selectedMonth}&year=${selectedYear}`;
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch filtered requests');

      const data = await response.json();
      setFilteredRequests(data);
    } catch (err) {
      console.error('Filter fetch error:', err);
      setError('Failed to fetch filtered data.');
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <Header />
      <div className="tps-container">
        <h2 className="tps-heading">Third Party Optional Services</h2>

        <form className="tps-form" onSubmit={handleSubmit}>
          <label>Student's Name:</label>
          <select name="studentName" value={formData.studentName} onChange={handleChange} className="tps-input" required>
            <option value="">Select a student</option>
            {students.map((s) => (
              <option key={s.id} value={s.name}>
                {s.name}
              </option>
            ))}
          </select>

          <input type="email" name="email" value={formData.email} onChange={handleChange} className="tps-input" required placeholder="Email" />
          <input type="tel" name="phoneNo" value={formData.phoneNo} onChange={handleChange} className="tps-input" required placeholder="Phone Number" />

          <div className="tps-services">
            <label className="tps-service-label">Select Services:</label>
            <div className="tps-service-option">
              <input type="checkbox" name="selectedServices" value="Transport Service" onChange={handleChange} className="tps-checkbox" />
              <label>Transport Service</label>
            </div>
            <div className="tps-service-option">
              <input type="checkbox" name="selectedServices" value="Meal Plan" onChange={handleChange} className="tps-checkbox" />
              <label>Meal Plan</label>
            </div>
          </div>

          <button type="submit" className="tps-submit-button">Submit Request</button>
        </form>

        {status && <p className="tps-status-message">Current Status: {status}</p>}

        <div className="tps-filter-section">
          <h3>Filter Requests By Month & Year</h3>
          <select value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)} className="tps-input">
            <option value="">Month</option>
            {[...Array(12)].map((_, i) => (
              <option key={i} value={i + 1}>{i + 1}</option>
            ))}
          </select>
          <select value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)} className="tps-input">
            <option value="">Year</option>
            {[2024, 2025, 2026].map((year) => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
          <button onClick={handleFilter} className="tps-submit-button">Filter</button>
        </div>

        {filteredRequests.length > 0 && (
          <div className="tps-past-requests">
            <ul>
              {filteredRequests.map((req, index) => (
                <li key={index} className="tps-request-item">
                  <p>Student: {req.studentName}</p>
                  <p>Services: {req.selectedServices?.join(', ')}</p>
                  <p>Status: {req.status}</p>
                  <p>Date: {new Date(req.createdAt).toLocaleDateString()}</p>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default ThirdPartyServices;
