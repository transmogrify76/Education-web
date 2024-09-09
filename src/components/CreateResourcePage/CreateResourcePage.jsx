import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import './CreateResourcePage.css'; // Import the CSS file

const CreateResourcePage = () => {
  const { teacherId } = useParams(); // Get teacherId from URL parameters
  const [classes, setClasses] = useState([]);
  const [resources, setResources] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState('document');
  const [content, setContent] = useState('');
  const [classId, setClassId] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch classes and resources on component mount
  useEffect(() => {
    const fetchClassesAndResources = async () => {
      try {
        // Fetch classes
        const classesResponse = await axios.get('http://localhost:3000/class');
        setClasses(classesResponse.data);

        // Fetch resources for the teacher
        const resourcesResponse = await axios.get(`http://localhost:3000/resources/by-teacher/${teacherId}`);
        setResources(resourcesResponse.data);
      } catch (error) {
        setError('Error fetching data');
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchClassesAndResources();
  }, [teacherId]);

  const handleSubmit = (event) => {
    event.preventDefault();

    const resourceData = {
      title,
      description,
      type,
      content,
      classId: parseInt(classId, 10),
    };

    axios.post(`http://localhost:3000/resources`, resourceData, {
      params: { teacherId }
    })
      .then(response => {
        alert('Resource created successfully!');
        setTitle('');
        setDescription('');
        setType('document');
        setContent('');
        setClassId('');
        // Refresh resources list
        return axios.get(`http://localhost:3000/resources/by-teacher/${teacherId}`);
      })
      .then(response => setResources(response.data))
      .catch(error => console.error('Error creating resource:', error));
  };

  const handleDelete = (resourceId) => {
    if (window.confirm('Are you sure you want to delete this resource?')) {
      axios.delete(`http://localhost:3000/resources/${resourceId}`)
        .then(response => {
          alert('Resource deleted successfully!');
          // Refresh resources list
          return axios.get(`http://localhost:3000/resources/by-teacher/${teacherId}`);
        })
        .then(response => setResources(response.data))
        .catch(error => console.error('Error deleting resource:', error));
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
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
            <label htmlFor="content">Document Path:</label>
            <input
              id="content"
              type="text"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </div>
        )}
        <div>
          <label htmlFor="classId">Class ID:</label>
          <input
            id="classId"
            type="text"
            value={classId}
            onChange={(e) => setClassId(e.target.value)}
            required
          />
        </div>
        <button type="submit">Create Resource</button>
      </form>

      <h2>Resources for Teacher {teacherId}</h2>
      <ul>
        {resources.length > 0 ? (
          resources.map((resource) => (
            <li key={resource.id}>
              <h3>{resource.title}</h3>
              <p>{resource.description}</p>
              <p>Type: {resource.type}</p>
              <p>Content: {resource.content}</p>
              <p>Class ID: {resource.classId}</p>
              <button onClick={() => handleDelete(resource.id)}>Delete</button>
            </li>
          ))
        ) : (
          <p>No resources found for this teacher.</p>
        )}
      </ul>
    </div>
  );
};

export default CreateResourcePage;
