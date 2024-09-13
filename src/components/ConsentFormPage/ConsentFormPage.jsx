import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ConsentFormPage.css';
import Header from '../Header/Header';
const ConsentFormPage = () => {
  const [consentForms, setConsentForms] = useState([]);

  useEffect(() => {
    // Fetch all consent forms from the API
    axios.get('http://localhost:3000/consent')
      .then(response => {
        // Sort forms by ID in ascending order (older first)
        const sortedForms = response.data.sort((a, b) => a.id - b.id);
        setConsentForms(sortedForms);
      })
      .catch(error => {
        console.error('Error fetching consent forms:', error);
      });
  }, []);

  return (
    <div>
      <Header/>
    <div className="consent-form-page">
      <h2>Consent Form Management</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Parent Name</th>
            <th>Student Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Selected Option</th>
          </tr>
        </thead>
        <tbody>
          {consentForms.map(form => (
            <tr key={form.id}>
              <td>{form.id}</td>
              <td>{form.parentName}</td>
              <td>{form.studentName}</td>
              <td>{form.email}</td>
              <td>{form.phone}</td>
              <td>{form.selectedOption}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
          
    </div>
  );
};

export default ConsentFormPage;
