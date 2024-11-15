import React, { useState } from 'react';
import axios from 'axios';
import './CreateSurveyForm.css';
import Header from '../Header/Header';
const CreateSurveyForm = () => {
  const [title, setTitle] = useState('');
  const [topic, setTopic] = useState('');
  const [description, setDescription] = useState('');
  const [createdBy, setCreatedBy] = useState('');
  const [googleFormLink, setGoogleFormLink] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [message, setMessage] = useState('');
  const handleSubmit = async (e) => {
    e.preventDefault();
    const surveyData = {
      title,
      topic,
      description,
      createdBy,
      googleFormLink,
      isActive,
    };

    try {
      const response = await axios.post('http://localhost:3000/surveys', surveyData);
      setMessage('Survey created successfully!');
      setTitle('');
      setTopic('');
      setDescription('');
      setCreatedBy('');
      setGoogleFormLink('');
      setIsActive(true);
    } catch (error) {
      setMessage('Error creating survey. Please try again.');
      console.error(error);
    }
  };

  return (
    <div>
        <Header/>

    <div className="create-survey-form">
      <h1>Create a New Survey</h1>
      {message && <p className="message">{message}</p>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="topic">Topic</label>
          <input
            type="text"
            id="topic"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="createdBy">Created By</label>
          <input
            type="text"
            id="createdBy"
            value={createdBy}
            onChange={(e) => setCreatedBy(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="googleFormLink">Google Form Link</label>
          <input
            type="url"
            id="googleFormLink"
            value={googleFormLink}
            onChange={(e) => setGoogleFormLink(e.target.value)}
            required
          />
        </div>

        <button type="submit">Create Survey</button>
      </form>
    </div>
    </div>
  );
};

export default CreateSurveyForm;
