import React, { useState } from 'react';
import './CounselingRequest.css';

const CounselingRequest = () => {
  const [formData, setFormData] = useState({
    areaOfConcern: '',
    observation: '',
    concernFrequency: '',
    supportRequired: '',
    supportType: '',
    supportingDocuments: [],
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileUpload = (e, fieldName) => {
    setFormData({
      ...formData,
      [fieldName]: [...formData[fieldName], e.target.files[0]],
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted', formData);
  };

  return (
    <div className="counseling-form-container">
      <h2>Counseling Request Form</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-grid">
          <div className="form-group left">
            <label htmlFor="area-of-concern">Areas of concern</label>
            <select
              id="area-of-concern"
              name="areaOfConcern"
              value={formData.areaOfConcern}
              onChange={handleChange}
            >
              <option value="">Select an area</option>
              <option value="Academic">Academic</option>
              <option value="Behavioral">Behavioral</option>
              <option value="Social">Social</option>
            </select>
          </div>
          <div className="form-group right">
            <label htmlFor="observation">
              Briefly describe your observation of the area of concern and since when you have observed it.
            </label>
            <textarea
              id="observation"
              name="observation"
              value={formData.observation}
              onChange={handleChange}
            ></textarea>
          </div>
          <div className="form-group right">
            <label htmlFor="concern-frequency">
              How frequently do you see your ward facing the concern?
            </label>
            <input
              type="text"
              id="concern-frequency"
              name="concernFrequency"
              value={formData.concernFrequency}
              onChange={handleChange}
            />
          </div>
          <div className="form-group left">
            <label htmlFor="support-required">Support required from</label>
            <input
              type="text"
              id="support-required"
              name="supportRequired"
              value={formData.supportRequired}
              onChange={handleChange}
            />
          </div>
          <div className="form-group right">
            <label htmlFor="support-type">What type of support are you expecting?</label>
            <textarea
              id="support-type"
              name="supportType"
              value={formData.supportType}
              onChange={handleChange}
            ></textarea>
          </div>
        </div>
        <div className="form-group">
          <label>Upload relevant documents as applicable:</label>
          <div className="upload-buttons">
            <div className="upload-btn-wrapper">
              <input
                type="file"
                name="supportingDocuments"
                onChange={(e) => handleFileUpload(e, 'supportingDocuments')}
              />
              <span>Supporting medical records</span>
            </div>
            <div className="upload-btn-wrapper">
              <input
                type="file"
                name="supportingDocuments"
                onChange={(e) => handleFileUpload(e, 'supportingDocuments')}
              />
              <span>External assessment report (from a Psychologist/Clinical Psychologist)</span>
            </div>
            <div className="upload-btn-wrapper">
              <input
                type="file"
                name="supportingDocuments"
                onChange={(e) => handleFileUpload(e, 'supportingDocuments')}
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
  );
};

export default CounselingRequest;
