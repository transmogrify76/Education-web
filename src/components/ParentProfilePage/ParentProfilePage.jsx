import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './ParentProfilePage.css';
import Header from '../Header/Header'

const ParentProfilePage = () => {
  const { parentId } = useParams();
  const [parentData, setParentData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchParentData = async () => {
      console.log('Fetching data for parentId:', parentId); // Debug log
      try {
        const response = await fetch(`http://localhost:3000/parent/${parentId}`);
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

    fetchParentData();
  }, [parentId]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!parentData) {
    return <p>No parent data available.</p>;
  }

  return (
    <div>
      <Header/>
    <div className="parent-profile-container">
      <h1>Parent Profile</h1>
      <div className="profile-card">
        <div className="profile-field"><strong>ID:</strong> {parentData.id}</div>
        <p className="profile-field"><strong>Name:</strong> {parentData.name}</p>
        <p className="profile-field"><strong>Student Name:</strong> {parentData.studentName}</p>
        <p className="profile-field"><strong>Email:</strong> {parentData.email}</p>
        <p className="profile-field"><strong>Phone Number:</strong> {parentData.phoneNo}</p>
        <p className="profile-field"><strong>Address:</strong> {parentData.address}</p>
      </div>
    </div>
    </div>
  );
};

export default ParentProfilePage;
