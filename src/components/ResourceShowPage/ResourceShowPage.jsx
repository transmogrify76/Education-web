import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';  // Use useLocation to access the passed state
import { jwtDecode } from 'jwt-decode'; // Import jwt-decode for decoding the JWT token
import './ResourceShowPage.css';
import Header from '../Header/Header';
import SideNav from '../SideNav/SideNav';

const ResourceShowPage = () => {
  const location = useLocation();
  const studentId = location.state?.studentId;  // Access studentId passed via state
  
  const [classes, setClasses] = useState([]);
  const [allResources, setAllResources] = useState([]);
  const [filteredResources, setFilteredResources] = useState([]);
  const [selectedClassId, setSelectedClassId] = useState('');
  const [studentClassId, setStudentClassId] = useState(''); // To store the decoded student class ID
  
  // Decode JWT token and extract student class info
  useEffect(() => {
    const token = localStorage.getItem('authToken');  // Assuming the token is stored in localStorage
    if (token) {
      const decodedToken = jwtDecode(token);  // Decode the JWT token
      const studentClassId = decodedToken.class.id; // Get class ID from token
      setStudentClassId(studentClassId);  // Set the student's class ID
    }
  }, []);

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

  // Filter resources whenever studentClassId or allResources changes
  useEffect(() => {
    if (studentClassId) {
      const filtered = allResources.filter(resource => resource.classId === Number(studentClassId));
      setFilteredResources(filtered);
    } else {
      setFilteredResources([]);  // Clear resources if no class is selected
    }
  }, [studentClassId, allResources]);

  // Render content based on resource type (link or document)
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
        <SideNav studentId={studentId} /> {/* Pass studentId to SideNav */}
        <div className="resource-show-container">
          <h1>Resource Show Page</h1>

          {/* Automatically set the class based on JWT decoding */}
          {studentClassId && (
            <div className="class-dropdown-container">
              <label htmlFor="classDropdown">Class:</label>
              <select
                id="classDropdown"
                value={studentClassId}
                onChange={(e) => setSelectedClassId(e.target.value)}
                disabled // Disable the dropdown since it's automatically set from the token
              >
                {classes.map((classItem) => (
                  <option key={classItem.id} value={classItem.id}>
                    {classItem.className}
                  </option>
                ))}
              </select>
            </div>
          )}

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
