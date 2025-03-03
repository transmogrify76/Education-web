import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './GetSurveys.css';

const GetSurveys = () => {
  const [surveys, setSurveys] = useState([]);
  const [message, setMessage] = useState('');

  // Fetch all surveys when the component mounts
  useEffect(() => {
    const fetchSurveys = async () => {
      try {
        const response = await axios.get('http://192.168.0.103:3000/surveys');
        setSurveys(response.data);
      } catch (error) {
        setMessage('Error fetching surveys.');
        console.error(error);
      }
    };

    fetchSurveys();
  }, []);

  return (
    <div className="get-surveys-page">
      <h1>All Surveys</h1>

      {message && <p className="message">{message}</p>}

      {surveys.length > 0 ? (
        <div className="survey-list">
          {surveys.map((survey) => (
            <div key={survey.id} className="survey-card">
              <h3>{survey.title}</h3>
              <p><strong>Topic:</strong> {survey.topic}</p>
              <p><strong>Description:</strong> {survey.description}</p>
              <p><strong>Created By:</strong> {survey.createdBy}</p>
              <a href={survey.googleFormLink} target="_blank" rel="noopener noreferrer">
                <button className="survey-link-btn">Go to Google Form</button>
              </a>
            </div>
          ))}
        </div>
      ) : (
        <p>No surveys available.</p>
      )}
    </div>
  );
};

export default GetSurveys;
