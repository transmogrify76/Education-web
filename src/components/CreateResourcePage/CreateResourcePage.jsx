import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {jwtDecode} from 'jwt-decode';
import './CreateResourcePage.css';
import Header from '../Header/Header';

const CreateResourcePage = () => {
  const [teacherId, setTeacherId] = useState(null);
  const [classes, setClasses] = useState([]);
  const [resources, setResources] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState('document');
  const [content, setContent] = useState('');
  const [classId, setClassId] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const token = localStorage.getItem('authToken');

  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setTeacherId(decoded?.id);
      } catch (err) {
        console.error('Error decoding token:', err);
        setError('Invalid token.');
        setLoading(false);
      }
    } else {
      setError('No token found.');
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (!teacherId) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        setError('');

        const teacherResponse = await axios.get(`http://192.168.0.103:3000/teacher/${teacherId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        let teacherClasses = Array.isArray(teacherResponse.data.classes) ? teacherResponse.data.classes : [];

        teacherClasses = teacherClasses.sort((a, b) => {
          const numA = parseInt(a.className.match(/\d+/));
          const numB = parseInt(b.className.match(/\d+/));
          return numA - numB;
        });

        setClasses(teacherClasses);

        const resourcesResponse = await axios.get(`http://192.168.0.103:3000/resources/by-teacher/${teacherId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setResources(resourcesResponse.data);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to fetch data.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [teacherId, token]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim() || !description.trim() || !classId) {
      alert('Please fill all required fields');
      return;
    }

    if (type === 'document' && !content.trim()) {
      alert('Please provide the document URL/path.');
      return;
    }
    if (type === 'link' && !content.trim()) {
      alert('Please provide the link URL.');
      return;
    }

    try {
      const payload = {
        title,
        description,
        type,
        content,
        classId: Number(classId),
      };

      await axios.post(
        'http://192.168.0.103:3000/resources',
        payload,
        {
          params: { teacherId: Number(teacherId) },
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      alert('Resource created successfully!');

      // Clear form
      setTitle('');
      setDescription('');
      setType('document');
      setContent('');
      setClassId('');

      // Refresh resources list
      const updatedResources = await axios.get(
        `http://192.168.0.103:3000/resources/by-teacher/${teacherId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setResources(updatedResources.data);
    } catch (err) {
      console.error('Error creating resource:', err);
      alert('Failed to create resource.');
    }
  };

  const handleDelete = async (resourceId) => {
    if (!window.confirm('Are you sure you want to delete this resource?')) return;

    try {
      await axios.delete(`http://192.168.0.103:3000/resources/${resourceId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert('Resource deleted successfully!');

      const updatedResources = await axios.get(
        `http://192.168.0.103:3000/resources/by-teacher/${teacherId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setResources(updatedResources.data);
    } catch (err) {
      console.error('Error deleting resource:', err);
      alert('Failed to delete resource.');
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

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

          <div>
            <label htmlFor="content">
              {type === 'document' ? 'Document URL/Path:' : 'Link URL:'}
            </label>
            <input
              id="content"
              type="text"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
            />
          </div>

          <div>
            <label htmlFor="classId">Select Class:</label>
            <select
              id="classId"
              value={classId}
              onChange={(e) => setClassId(e.target.value)}
              required
            >
              <option value="">Select Class...</option>
              {classes.map((cls) => (
                <option key={cls.id} value={cls.id}>
                  {cls.className}
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
              const classItem = classes.find((cls) => cls.id === resource.classId);
              return (
                <li key={resource.id}>
                  <h3>{resource.title}</h3>
                  <p>{resource.description}</p>
                  <p>Type: {resource.type}</p>
                  <p>
                    Content:{' '}
                    {resource.type === 'link' ? (
                      <a href={resource.content} target="_blank" rel="noopener noreferrer">
                        {resource.content}
                      </a>
                    ) : (
                      resource.content
                    )}
                  </p>
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
