import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './ParentProfilePage.css';

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
    <div className="parent-profile-container">
      <h1>Parent Profile</h1>
      <div className="profile-card">
        <p><strong>ID:</strong> {parentData.id}</p>
        <p><strong>Name:</strong> {parentData.name}</p>
        <p><strong>Student Name:</strong> {parentData.studentName}</p>
        <p><strong>Email:</strong> {parentData.email}</p>
        <p><strong>Phone Number:</strong> {parentData.phoneNo}</p>
        <p><strong>Address:</strong> {parentData.address}</p>
      </div>
    </div>
  );
};

export default ParentProfilePage;
