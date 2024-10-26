import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './ShowEbookPage.css';
import Header from '../Header/Header'; 

const ShowEbookPage = () => {
  const { studentId } = useParams(); 
  const [classId, setClassId] = useState(null); 
  const [ebooks, setEbooks] = useState([]); 
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(null); 

  
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        console.log('Fetching all classes'); 
        const response = await fetch('http://localhost:3000/class'); 
        const data = await response.json();
        console.log('Classes data:', data); 

        // Check each class for the student ID
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

  
  useEffect(() => {
    if (classId) {
      const fetchEbooks = async () => {
        try {
          console.log(`Fetching ebooks for classId: ${classId}`); 
          const response = await fetch(`http://localhost:3000/ebooks/class/${classId}`);
          const ebookData = await response.json();
          console.log('Ebook data:', ebookData); 
          setEbooks(ebookData);
        } catch (err) {
          console.error('Error fetching ebooks:', err);
          setError('Error fetching ebooks');
        }
      };

      fetchEbooks();
    }
  }, [classId]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
        <Header/>
    <div className="ebook-page">
      <h1>Ebooks for Class {classId}</h1>
      <div className="ebook-list">
        {ebooks.length > 0 ? (
          ebooks.map((ebook) => (
            <div key={ebook.id} className="ebook-item">
              <h2>{ebook.title}</h2>
              <p>{ebook.description}</p>
              <a 
                href={`http://localhost:3000/ebooks/download/${ebook.pdfUrl.split('/').pop()}`} 
                target="_blank" 
                rel="noopener noreferrer" 
                download 
              >
                Download PDF
              </a>
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
