import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './EbookPage.css';
import Header from '../Header/Header';

const EbookPage = () => {
  const [classOptions, setClassOptions] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    classId: '',
  });
  const [pdfFile, setPdfFile] = useState(null);
  const [message, setMessage] = useState('');
  useEffect(() => {
    const fetchClassOptions = async () => {
      try {
        const response = await axios.get('http://localhost:3000/class');
        console.log(response.data); 
        setClassOptions(response.data); 
      } catch (error) {
        console.error('There was an error fetching the class options:', error);
      }
    };
    fetchClassOptions();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setPdfFile(e.target.files[0]);
  };

  const handleClassChange = (e) => {
    setFormData({ ...formData, classId: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append('title', formData.title);
    data.append('description', formData.description);
    data.append('classId', formData.classId);
    data.append('file', pdfFile);

    try {
      await axios.post('http://localhost:3000/ebooks', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setMessage('Ebook created successfully!');
    } catch (error) {
      setMessage('Failed to create ebook.');
    }
  };

  return (
    <div>
    <Header />
    <div className="ebook-page">
      
      <h1>Create a New Ebook</h1>
      {message && <p className="message">{message}</p>}
      <form className="ebook-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            required
          ></textarea>
        </div>

        <div className="form-group">
          <label htmlFor="classId">Select Class</label>
          <select
            id="classId"
            name="classId"
            value={formData.classId}
            onChange={handleClassChange}
            required
          >
            <option value="">Select a class</option>
            {classOptions.map((classOption) => (
              <option key={classOption} value={classOption}>
                {classOption.className}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="file">Upload PDF</label>
          <input
            type="file"
            id="file"
            name="file"
            accept=".pdf"
            onChange={handleFileChange}
            required
          />
        </div>

        <button type="submit" className="submit-btn">Create Ebook</button>
      </form>
    </div>
    </div>
  );
};

export default EbookPage;
