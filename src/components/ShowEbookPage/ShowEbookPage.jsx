import React, { useEffect, useState } from 'react';
import {jwtDecode} from 'jwt-decode'; // Import jwt-decode
import axios from 'axios';
import Header from '../Header/Header';
import './ShowEbookPage.css';

const ShowEbookPage = () => {
  const [classId, setClassId] = useState(null);
  const [ebooks, setEbooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [studentId, setStudentId] = useState(null);

  // Decode the authToken from localStorage to get the studentId
  useEffect(() => {
    const token = localStorage.getItem('authToken'); // Get the token from localStorage
    if (token) {
      try {
        const decodedToken = jwtDecode(token); // Decode the token
        setStudentId(decodedToken.Id); // Assuming 'studentId' is in the token payload
      } catch (err) {
        console.error('Error decoding token:', err);
        setError('Invalid or expired token');
      }
    } else {
      setError('No auth token found');
    }
  }, []);

  // Fetch class based on studentId
  useEffect(() => {
    if (studentId) {
      const fetchClasses = async () => {
        const token = localStorage.getItem('authToken'); // Get the token from localStorage
        const config = {
          headers: {
            Authorization: `Bearer ${token}`, // Add Authorization header
          },
        };

        try {
          const response = await axios.get('http://192.168.0.103:3000/class', config); // Pass config
          const data = response.data;

          // Find class by matching studentId
          const studentClass = data.find((cls) =>
            cls.students.some((student) => student.id === studentId)
          );

          if (studentClass) {
            setClassId(studentClass.id);
          } else {
            setError('Class not found for this student');
          }
        } catch (err) {
          console.error('Error fetching classes:', err);
          setError('Error fetching classes');
        } finally {
          setLoading(false);
        }
      };

      fetchClasses();
    }
  }, [studentId]);

  // Fetch eBooks for the specific classId
  useEffect(() => {
    if (classId) {
      const fetchEbooks = async () => {
        const token = localStorage.getItem('authToken'); // Get the token from localStorage
        const config = {
          headers: {
            Authorization: `Bearer ${token}`, // Add Authorization header
          },
        };

        try {
          const response = await axios.get(`http://192.168.0.103:3000/ebooks/${classId}`, config); // Pass config
          setEbooks(response.data);
        } catch (err) {
          console.error('Error fetching ebooks:', err);
          setError('Error fetching ebooks');
        }
      };

      fetchEbooks();
    }
  }, [classId]);

  // Handle eBook download
  const handleDownload = async (ebookId, ebookTitle) => {
    const token = localStorage.getItem('authToken'); // Get the token from localStorage
    const config = {
      headers: {
        Authorization: `Bearer ${token}`, // Add Authorization header
      },
    };

    try {
      const response = await axios({
        url: `http://192.168.0.103:3000/ebooks/download/${ebookId}`,
        method: 'GET',
        responseType: 'blob',
        ...config, 

      });

      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${ebookTitle}.pdf`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading file:', error);
      setError('Failed to download the eBook. Please try again later.');
    }
  };

  const handleView = async (ebookId) => {
    const token = localStorage.getItem('authToken'); // Get the token from localStorage
    const config = {
      headers: {
        Authorization: `Bearer ${token}`, // Add Authorization header
      },
    };

    try {
      const response = await axios({
        url: `http://192.168.0.103:3000/ebooks/download/${ebookId}`,
        method: 'GET',
        responseType: 'blob',
        ...config, // Pass config
      });

      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      window.open(url, '_blank');
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error viewing file:', error);
      setError('Failed to open the eBook. Please try again later.');
    }
  };

  if (loading) return <div></div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <Header />
      <div className="ebook-page">
        <h1>Ebooks for Class {classId}</h1>
        <div className="ebook-list">
          {ebooks.length > 0 ? (
            ebooks.map((ebook) => (
              <div key={ebook.id} className="ebook-item">
                <h2>{ebook.title}</h2>
                <p>{ebook.description}</p>
                <button
                  onClick={() => handleDownload(ebook.id, ebook.title)}
                  className="download-btn"
                >
                  Download PDF
                </button>
                <button
                  onClick={() => handleView(ebook.id)}
                  className="view-btn"
                >
                  View PDF
                </button>
              </div>
            ))
          ) : (
            <p>No ebooks found for this class.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShowEbookPage;
