import React, { useEffect, useState } from 'react';
import {jwtDecode} from 'jwt-decode'; // Import jwt-decode to decode the token
import './ParentProfilePage.css';
import Header from '../Header/Header';

const ParentProfilePage = () => {
  const [parentData, setParentData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get the authToken from localStorage
    const authToken = localStorage.getItem('authToken');
    if (authToken) {
      try {
        // Decode the token to get the parentId
        const decodedToken = jwtDecode(authToken);
        const parentId = decodedToken.id; // Extract parentId from the decoded token

        const fetchParentData = async () => {
          console.log('Fetching data for parentId:', parentId); // Debug log
          try {
            const response = await fetch(`http://192.168.0.103:3000/parent/${parentId}`);
            if (!response.ok) {
              throw new Error('Network response was not ok');
            }
            const data = await response.json();
            console.log('Fetched data:', data); // Debug log
            setParentData(data);
          } catch (error) {
            console.error('Error fetching parent data:', error);
          } finally {
            setLoading(false);
          }
        };

        fetchParentData(); // Fetch data for the parentId
      } catch (error) {
        console.error('Failed to decode authToken:', error);
        setLoading(false); // Stop loading even if decoding fails
      }
    } else {
      console.error('No authToken found in localStorage');
      setLoading(false); // Stop loading if no token is found
    }
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!parentData) {
    return <p>No parent data available.</p>;
  }

  return (
    <div>
      <Header />
      <div className="parent-profile-container">
        <h1>Parent Profile</h1>
        <div className="profile-card">
          <div className="profile-field"><strong>ID:</strong> {parentData.id}</div>
          <p className="profile-field"><strong>Name:</strong> {parentData.name}</p>
          <p className="profile-field"><strong>Email:</strong> {parentData.email}</p>
          <p className="profile-field"><strong>Phone Number:</strong> {parentData.phoneNo}</p>
          <p className="profile-field"><strong>Address:</strong> {parentData.address}</p>
          <p className="profile-field"><strong>Occupation:</strong> {parentData.occupation}</p>
          <p className="profile-field"><strong>Relation Type:</strong> {parentData.relationType}</p>

          <h3>Children:</h3>
          {parentData.students && parentData.students.length > 0 ? (
            <ul>
              {parentData.students.map((student) => (
                <li key={student.id}>{student.name}</li> // Displaying student names
              ))}
            </ul>
          ) : (
            <p>No children data available.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ParentProfilePage;
