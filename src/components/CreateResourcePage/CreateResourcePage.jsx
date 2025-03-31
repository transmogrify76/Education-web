import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode'; // Import jwt-decode for decoding the token
import './CreateResourcePage.css';
import Header from '../Header/Header';

const CreateResourcePage = () => {
  const [teacherId, setTeacherId] = useState(null); // Store teacherId from the token
  const [classes, setClasses] = useState([]); // Store all classes
  const [resources, setResources] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState('document');
  const [file, setFile] = useState(null); // Store selected file
  const [content, setContent] = useState(''); // Store content URL for link type
  const [classId, setClassId] = useState(''); // Store the selected classId
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const token = localStorage.getItem('authToken'); // Get the token from localStorage

  // Decode the JWT token and extract the teacherId
  useEffect(() => {
    if (token) {
      try {
        const decodedToken = jwtDecode(token); // Decode the token
        setTeacherId(decodedToken.id); // Assuming teacherId is in the token
      } catch (error) {
        console.error('Error decoding JWT token:', error);
      }
    }
  }, [token]);

  // Fetch classes and resources on component mount
  useEffect(() => {
    if (teacherId) {
      const fetchClassesAndResources = async () => {
        try {
          // Fetch all classes
          const classesResponse = await axios.get('http://192.168.0.103:3000/class');
          setClasses(classesResponse.data);

          // Fetch resources for the teacher
          const resourcesResponse = await axios.get(`http://192.168.0.103:3000/resources/by-teacher/${teacherId}`);
          setResources(resourcesResponse.data);
        } catch (error) {
          setError('Error fetching data');
          console.error('Error fetching data:', error);
        } finally {
          setLoading(false);
        }
      };

      fetchClassesAndResources();
    }
  }, [teacherId]); // Re-run the effect when teacherId is set

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('type', type);
    formData.append('classId', classId);

    if (type === 'document' && file) {
      formData.append('file', file); // Append the selected file
    } else if (type === 'link' && content) {
      formData.append('content', content); // Append the URL content for links
    }

    try {
      await axios.post('http://192.168.0.103:3000/resources', formData, {
        headers: {
          'Content-Type': 'multipart/form-data', // Set the correct content type for file uploads
          params: { teacherId }
        }
      });

      alert('Resource created successfully!');
      setTitle('');
      setDescription('');
      setType('document');
      setContent('');
      setClassId('');
      setFile(null); // Reset file input

      // Refresh resources list
      const updatedResources = await axios.get(`http://192.168.0.103:3000/resources/by-teacher/${teacherId}`);
      setResources(updatedResources.data);
    } catch (error) {
      console.error('Error creating resource:', error);
    }
  };

  const handleDelete = async (resourceId) => {
    if (window.confirm('Are you sure you want to delete this resource?')) {
      try {
        await axios.delete(`http://192.168.0.103:3000/resources/${resourceId}`);
        alert('Resource deleted successfully!');

        // Refresh resources list
        const updatedResources = await axios.get(`http://192.168.0.103:3000/resources/by-teacher/${teacherId}`);
        setResources(updatedResources.data);
      } catch (error) {
        console.error('Error deleting resource:', error);
      }
    }
  };

  if (loading) return <p></p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <Header />
      <div className="create-resource-container">
        <h1>Create and View Resources</h1>
        <form className="create-resource-form" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="title">Title:</label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="description">Description:</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="type">Type:</label>
            <select
              id="type"
              value={type}
              onChange={(e) => setType(e.target.value)}
            >
              <option value="document">Document</option>
              <option value="link">Link</option>
            </select>
          </div>

          {type === 'link' ? (
            <div>
              <label htmlFor="content">Link URL:</label>
              <input
                id="content"
                type="text"
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
            </div>
          ) : (
            <div>
              <label htmlFor="file">Document File:</label>
              <input
                id="file"
                type="file"
                onChange={(e) => setFile(e.target.files[0])}
                required={type === 'document'} // Make it required for document type
              />
            </div>
          )}

          <div>
            <label htmlFor="classId">Select Class:</label>
            <select
              id="classId"
              value={classId}
              onChange={(e) => setClassId(e.target.value)}
              required
            >
              <option value="">Select Class...</option>
              {classes.map((classItem) => (
                <option key={classItem.id} value={classItem.id}>
                  {classItem.className}
                </option>
              ))}
            </select>
          </div>
          <button type="submit">Create Resource</button>
        </form>

        <h2>Resources for Teacher {teacherId}</h2>
        <ul>
          {resources.length > 0 ? (
            resources.map((resource) => {
              const classItem = classes.find(cls => cls.id === resource.classId);

              return (
                <li key={resource.id}>
                  <h3>{resource.title}</h3>
                  <p>{resource.description}</p>
                  <p>Type: {resource.type}</p>
                  <p>Content: {resource.content}</p>
                  <p>Class: {classItem ? classItem.className : 'Class not found'}</p>
                  <button onClick={() => handleDelete(resource.id)}>Delete</button>
                </li>
              );
            })
          ) : (
            <p>No resources found for this teacher.</p>
          )}
        </ul>
      </div>
    </div>
  );
};

export default CreateResourcePage;
