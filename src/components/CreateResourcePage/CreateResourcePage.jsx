import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import './CreateResourcePage.css';
import Header from '../Header/Header';

const CreateResourcePage = () => {
  const [teacherId, setTeacherId] = useState(null);
  const [classes, setClasses] = useState([]);
  const [resources, setResources] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState('document');
  const [file, setFile] = useState(null);
  const [content, setContent] = useState('');
  const [classId, setClassId] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const token = localStorage.getItem('authToken');

  // Get teacherId from token
  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setTeacherId(decoded?.id);
      } catch (error) {
        console.error('Error decoding JWT token:', error);
      }
    }
  }, [token]);

  // Fetch only teacher's classes and their resources
  useEffect(() => {
    if (!teacherId) return;

    const fetchTeacherClassesAndResources = async () => {
      try {
        // Fetch teacher details (including their assigned classes)
        const teacherResponse = await axios.get(`http://192.168.0.103:3000/teacher/${teacherId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        let teacherClasses = Array.isArray(teacherResponse.data.classes) ? teacherResponse.data.classes : [];

        // Sort classes numerically by className
        teacherClasses = teacherClasses.sort((a, b) => {
          const numA = parseInt(a.className.match(/\d+/));
          const numB = parseInt(b.className.match(/\d+/));
          return numA - numB;
        });

        setClasses(teacherClasses);

        // Fetch resources created by this teacher
        const resourcesResponse = await axios.get(`http://192.168.0.103:3000/resources/by-teacher/${teacherId}`);
        setResources(resourcesResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Error fetching data');
      } finally {
        setLoading(false);
      }
    };

    fetchTeacherClassesAndResources();
  }, [teacherId, token]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('type', type);
    formData.append('classId', classId);

    if (type === 'document' && file) {
      formData.append('file', file);
    } else if (type === 'link' && content) {
      formData.append('content', content);
    }

    try {
      await axios.post('http://192.168.0.103:3000/resources', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        params: { teacherId },
      });

      alert('Resource created successfully!');
      setTitle('');
      setDescription('');
      setType('document');
      setContent('');
      setClassId('');
      setFile(null);

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

        // Refresh resources
        const updatedResources = await axios.get(`http://192.168.0.103:3000/resources/by-teacher/${teacherId}`);
        setResources(updatedResources.data);
      } catch (error) {
        console.error('Error deleting resource:', error);
      }
    }
  };

  if (loading) return <p>Loading...</p>;
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
                required={type === 'document'}
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
