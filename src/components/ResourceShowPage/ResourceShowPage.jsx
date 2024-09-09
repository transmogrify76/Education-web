import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import './ResourceShowPage.css';
import Header from '../Header/Header';
import SideNav from '../SideNav/SideNav';

const ResourceShowPage = () => {
  const { studentId } = useParams();
  const [classes, setClasses] = useState([]);
  const [allResources, setAllResources] = useState([]);
  const [filteredResources, setFilteredResources] = useState([]);
  const [selectedClassId, setSelectedClassId] = useState('');

  // Fetch all classes on component mount
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const response = await axios.get('http://localhost:3000/class');
        setClasses(response.data);
      } catch (error) {
        console.error('Error fetching classes:', error);
      }
    };

    fetchClasses();
  }, []);

  // Fetch all resources on component mount
  useEffect(() => {
    const fetchResources = async () => {
      try {
        const response = await axios.get('http://localhost:3000/resources');
        setAllResources(response.data);
      } catch (error) {
        console.error('Error fetching resources:', error);
      }
    };

    fetchResources();
  }, []);

  // Filter resources whenever selectedClassId changes
  useEffect(() => {
    if (selectedClassId) {
      const filtered = allResources.filter(resource => resource.classId === Number(selectedClassId));
      setFilteredResources(filtered);
    } else {
      setFilteredResources([]); // Clear resources if no class is selected
    }
  }, [selectedClassId, allResources]);

  const renderContent = (type, content) => {
    if (type === 'link') {
      return (
        <div>
          <strong>Link:</strong> <a href={content} target="_blank" rel="noopener noreferrer">{content}</a>
        </div>
      );
    } else if (type === 'document') {
      return (
        <div>
          <strong>Path:</strong> {content}
        </div>
      );
    }
    return null;
  };

  return (
    <div className='for-header'>
      <Header />
      <div className="teaching-staff">
        <SideNav studentId={studentId} />
        <div className="resource-show-container">
          <h1>Resource Show Page</h1>

          <div className="class-dropdown-container">
            <label htmlFor="classDropdown">Select a Class:</label>
            <select
              id="classDropdown"
              value={selectedClassId}
              onChange={(e) => setSelectedClassId(e.target.value)}
            >
              <option value="">Select a class</option>
              {classes.map((classItem) => (
                <option key={classItem.id} value={classItem.id}>
                  {classItem.className} (ID: {classItem.id})
                </option>
              ))}
            </select>
          </div>

          <div className="resource-list-container">
            <h2>Resources</h2>
            {filteredResources.length > 0 ? (
              <ul>
                {filteredResources.map((resource) => (
                  <li key={resource.id} className="resource-card">
                    <h3>{resource.title}</h3>
                    <p><strong>Description:</strong> {resource.description}</p>
                    <p><strong>Type:</strong> {resource.type}</p>
                    {renderContent(resource.type, resource.content)}
                    <p><strong>Created At:</strong> {new Date(resource.createdAt).toLocaleDateString()}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No resources available for this class.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResourceShowPage;
