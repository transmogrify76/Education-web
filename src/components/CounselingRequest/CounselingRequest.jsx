import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import {jwtDecode} from 'jwt-decode'; // Import jwt-decode to decode the token
import './CounselingRequest.css';
import Header from '../Header/Header';

const CounselingRequest = () => {
  const [students, setStudents] = useState([]);
  const [selectedStudentId, setSelectedStudentId] = useState('');
  const [formData, setFormData] = useState({
    areaOfConcern: 'Academic',
    description: '',
    frequency: '',
    supportRequiredFrom: '',
    expectedSupport: '',
    supportingMedicalRecords: null,
    externalAssessmentReport: null,
    otherDocuments: null,
  });
  const [parentData, setParentData] = useState({
    parentId: '',
    parentName: '',
    email: '',
    phoneNo: ''
  });

  useEffect(() => {
    // Get the authToken from localStorage
    const authToken = localStorage.getItem('authToken');
    if (authToken) {
      try {
        // Decode the token to get the parentId
        const decodedToken = jwtDecode(authToken);
        const parentId = decodedToken.id; // Assuming 'id' is the parentId in the token

        // Fetch parent data using the decoded parentId
        axios.get(`http://192.168.0.103:3000/parent/${parentId}`)
          .then((response) => {
            setParentData({
              parentId: parentId,
              parentName: response.data.name,
              email: response.data.email,
              phoneNo: response.data.phoneNo,
            });

            // Fetch students for the parent
            setStudents(response.data.students || []);
          })
          .catch((error) => console.error('Error fetching parent data:', error));

      } catch (error) {
        console.error('Failed to decode authToken:', error);
      }
    } else {
      console.error('No authToken found in localStorage');
    }
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileUpload = (e, fieldName) => {
    setFormData({
      ...formData,
      [fieldName]: e.target.files[0],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const finalFormData = {
      ...formData,
      areaOfConcern: formData.areaOfConcern || 'Academic',
    };

    const formDataToSend = new FormData();
    formDataToSend.append('areaOfConcern', finalFormData.areaOfConcern);
    formDataToSend.append('description', finalFormData.description);
    formDataToSend.append('frequency', finalFormData.frequency);
    formDataToSend.append('supportRequiredFrom', finalFormData.supportRequiredFrom);
    formDataToSend.append('expectedSupport', finalFormData.expectedSupport);
    if (finalFormData.supportingMedicalRecords) {
      formDataToSend.append('supportingMedicalRecords', finalFormData.supportingMedicalRecords);
    }
    if (finalFormData.externalAssessmentReport) {
      formDataToSend.append('externalAssessmentReport', finalFormData.externalAssessmentReport);
    }
    if (finalFormData.otherDocuments) {
      formDataToSend.append('otherDocuments', finalFormData.otherDocuments);
    }
    formDataToSend.append('studentId', selectedStudentId);
    formDataToSend.append('parentName', parentData.parentName);
    formDataToSend.append('email', parentData.email);
    formDataToSend.append('phoneNo', parentData.phoneNo);

    try {
      const response = await axios.post('http://192.168.0.103:3000/counseling-request', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 200) {
        alert('Counseling request submitted successfully!');
      } else {
        console.error('Error submitting form');
      }
    } catch (error) {
      console.error('Error submitting form:', error.response ? error.response.data : error.message);
    }
  };

  return (
    <div>
      <Header />
      <div className="counseling-form-container">
        <h2>Counseling Request Form</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            {/* Area of Concern */}
            <div className="form-group left">
              <label htmlFor="area-of-concern">Areas of concern</label>
              <select
                id="area-of-concern"
                name="areaOfConcern"
                value={formData.areaOfConcern}
                onChange={handleChange}
              >
                <option value="Academic">Academic</option>
                <option value="Behavioral">Behavioral</option>
                <option value="Social">Social</option>
              </select>
            </div>

            {/* Description */}
            <div className="form-group right">
              <label htmlFor="description">
                Briefly describe your observation of the area of concern and since when you have observed it.
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
              ></textarea>
            </div>

            {/* Frequency */}
            <div className="form-group right">
              <label htmlFor="frequency">
                How frequently do you see your ward facing the concern?
              </label>
              <input
                type="text"
                id="frequency"
                name="frequency"
                value={formData.frequency}
                onChange={handleChange}
              />
            </div>

            {/* Support Required */}
            <div className="form-group left">
              <label htmlFor="supportRequiredFrom">Support required from</label>
              <input
                type="text"
                id="supportRequiredFrom"
                name="supportRequiredFrom"
                value={formData.supportRequiredFrom}
                onChange={handleChange}
              />
            </div>

            {/* Expected Support */}
            <div className="form-group right">
              <label htmlFor="expectedSupport">What type of support are you expecting?</label>
              <textarea
                id="expectedSupport"
                name="expectedSupport"
                value={formData.expectedSupport}
                onChange={handleChange}
              ></textarea>
            </div>
            <div className="form-group left">
              <label htmlFor="studentId">Select Student</label>
              <select
                id="studentId"
                name="studentId"
                value={selectedStudentId}
                onChange={(e) => setSelectedStudentId(e.target.value)}
              >
                <option value="">Select a student</option>
                {students.map((student) => (
                  <option key={student.id} value={student.id}>
                    {student.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="form-group">
            <label>Upload relevant documents as applicable:</label>
            <div className="upload-buttons">
              <div className="upload-btn-wrapper">
                <input
                  type="file"
                  onChange={(e) => handleFileUpload(e, 'supportingMedicalRecords')}
                />
                <span>Supporting medical records</span>
              </div>
              <div className="upload-btn-wrapper">
                <input
                  type="file"
                  onChange={(e) => handleFileUpload(e, 'externalAssessmentReport')}
                />
                <span>External assessment report (from a Psychologist/Clinical Psychologist)</span>
              </div>
              <div className="upload-btn-wrapper">
                <input
                  type="file"
                  onChange={(e) => handleFileUpload(e, 'otherDocuments')}
                />
                <span>Any other supportive documents</span>
              </div>
            </div>
          </div>
          <div className="form-actions">
            <button type="submit" className="save-btn">
              Save
            </button>
            <button type="button" className="cancel-btn">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CounselingRequest;
