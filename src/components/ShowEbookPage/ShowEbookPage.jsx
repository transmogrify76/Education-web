// ShowEbookPage.js
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Header from '../Header/Header';
import './ShowEbookPage.css';

const ShowEbookPage = () => {
  const { studentId } = useParams();
  const [classId, setClassId] = useState(null);
  const [ebooks, setEbooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch class based on studentId
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const response = await axios.get('http://localhost:3000/class');
        const data = response.data;

        // Find class by matching studentId
        const studentClass = data.find((cls) =>
          cls.students.some((student) => student.id === Number(studentId))
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
  }, [studentId]);

  // Fetch eBooks for the specific classId
  useEffect(() => {
    if (classId) {
      const fetchEbooks = async () => {
        try {
          const response = await axios.get(`http://localhost:3000/ebooks/${classId}`);
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
    try {
      const response = await axios({
        url: `http://localhost:3000/ebooks/download/${ebookId}`,
        method: 'GET',
        responseType: 'blob', 
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
    try {
      const response = await axios({
        url: `http://localhost:3000/ebooks/download/${ebookId}`,
        method: 'GET',
        responseType: 'blob',
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

  if (loading) return <div>Loading...</div>;
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
