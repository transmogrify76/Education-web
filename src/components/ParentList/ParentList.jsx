import React, { useEffect, useState } from 'react';
import './ParentList.css';
import Header from '../Header/Header';

const ParentList = () => {
  const [parents, setParents] = useState([]); // Initialized as empty array
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [classes, setClasses] = useState([]); // To store classes
  const [selectedClassId, setSelectedClassId] = useState(null); // To store selected class ID
  const [editingParent, setEditingParent] = useState(null); // To store the parent being edited
  const [updatedParent, setUpdatedParent] = useState({
    name: '',
    phoneNo: '',
    email: '',
    address: '',
    occupation: '',
    relationType: ''
  });

  const authToken = localStorage.getItem('authToken');

  useEffect(() => {
    const fetchAllParents = async () => {
      try {
        const response = await fetch('http://localhost:3000/parent', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${authToken}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch parents data');
        }

        const data = await response.json();
        // Ensure the data is an array before setting state
        if (Array.isArray(data)) {
          setParents(data);
        } else {
          throw new Error('Fetched data is not an array');
        }
      } catch (err) {
        setError('Error fetching data: ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAllParents();
  }, [authToken]);

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const response = await fetch('http://localhost:3000/class', {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });
        const data = await response.json();
        setClasses(data);
      } catch (error) {
        console.error('Error fetching classes:', error);
      }
    };

    fetchClasses();
  }, [authToken]);

  useEffect(() => {
    const fetchParentsByClass = async () => {
      if (!selectedClassId) return; // Only fetch if a class is selected

      try {
        const response = await fetch(`http://localhost:3000/student/parents-by-class/${selectedClassId}`, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch parents by class');
        }

        const data = await response.json();
        setParents(data);
      } catch (err) {
        setError('Error fetching parents by class: ' + err.message);
      }
    };

    fetchParentsByClass();
  }, [selectedClassId, authToken]);

  const fetchAllParents = async () => {
    try {
      const response = await fetch('http://localhost:3000/parent', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch parents data');
      }

      const data = await response.json();
      // Ensure the data is an array before setting state
      if (Array.isArray(data)) {
        setParents(data);
      } else {
        throw new Error('Fetched data is not an array');
      }
    } catch (err) {
      setError('Error fetching data: ' + err.message);
    }
  };

  const handleClassChange = (e) => {
    const selectedValue = parseInt(e.target.value);
    if (selectedValue === 0) {
      // "View All" option selected
      setSelectedClassId(null);
      setError(''); // Reset error when changing class
      fetchAllParents(); // Fetch all parents
    } else {
      setSelectedClassId(selectedValue);
      setError(''); // Reset error when changing class
    }
  };

  const handleEdit = (parent) => {
    setEditingParent(parent);
    setUpdatedParent({
      name: parent.name,
      phoneNo: parent.phoneNo,
      email: parent.email,
      address: parent.address,
      occupation: parent.occupation,
      relationType: parent.relationType,
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const authToken = localStorage.getItem('authToken');

    try {
      const response = await fetch(`http://localhost:3000/parent/${editingParent.id}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedParent),
      });

      if (!response.ok) {
        throw new Error('Failed to update parent data');
      }

      // Re-fetch parents by class if selected, otherwise re-fetch all parents
      if (selectedClassId) {
        const response = await fetch(`http://localhost:3000/student/parents-by-class/${selectedClassId}`, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });
        const data = await response.json();
        setParents(data);
      } else {
        fetchAllParents();
      }

      // Reset editing state
      setEditingParent(null);
      setUpdatedParent({
        name: '',
        phoneNo: '',
        email: '',
        address: '',
        occupation: '',
        relationType: ''
      });
    } catch (err) {
      setError('Error updating data: ' + err.message);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <Header />

      <div className="parentListContainer">
        <h1>Parents List</h1>

        {/* Class selection dropdown */}
        <select value={selectedClassId || 0} onChange={handleClassChange}>
          <option value="0">View All</option>
          {classes.map((cls) => (
            <option key={cls.id} value={cls.id}>
             Class - {cls.className}
            </option>
          ))}
        </select>

        <div className="tableContainer">
          <table className="excelTable">
            <thead>
              <tr>
                <th>Parent Name</th>
                <th>Phone Number</th>
                <th>Email</th>
                <th>Address</th>
                <th>Occupation</th>
                <th>Relation Type</th>
                <th>Children</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {/* Safeguard against undefined 'parents' */}
              {parents && Array.isArray(parents) && parents.length > 0 ? (
                parents.map((parent) => (
                  <tr key={parent.id}>
                    <td className="excelTableCell">{parent.name}</td>
                    <td className="excelTableCell">{parent.phoneNo}</td>
                    <td className="excelTableCell">{parent.email}</td>
                    <td className="excelTableCell">{parent.address}</td>
                    <td className="excelTableCell">{parent.occupation}</td>
                    <td className="excelTableCell">{parent.relationType}</td>
                    <td className="excelTableCell">
                      <ul>
                        {parent.students && Array.isArray(parent.students) && parent.students.length > 0 ? (
                          parent.students.map((student) => (
                            <li key={student.id}>
                              {student.name} (Class: {student.class.className})<br />
                              <span>Email: {student.email}</span><br />
                              <span>DOB: {new Date(student.dob).toLocaleDateString()}</span><br />
                              <span>Roll No: {student.rollNo}</span>
                            </li>
                          ))
                        ) : (
                          <li>No students found</li>
                        )}
                      </ul>
                    </td>
                    <td className="excelTableCell">
                      <button className="button" onClick={() => handleEdit(parent)}>Edit</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8">No parents found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {editingParent && (
          <div className="editFormContainer">
            <h2>Edit Parent Information</h2>
            <form onSubmit={handleUpdate}>
              <label>
                Name:
                <input
                  type="text"
                  value={updatedParent.name}
                  onChange={(e) => setUpdatedParent({ ...updatedParent, name: e.target.value })}
                />
              </label>
              <label>
                Phone Number:
                <input
                  type="text"
                  value={updatedParent.phoneNo}
                  onChange={(e) => setUpdatedParent({ ...updatedParent, phoneNo: e.target.value })}
                />
              </label>
              <label>
                Email:
                <input
                  type="email"
                  value={updatedParent.email}
                  onChange={(e) => setUpdatedParent({ ...updatedParent, email: e.target.value })}
                />
              </label>
              <label>
                Address:
                <input
                  type="text"
                  value={updatedParent.address}
                  onChange={(e) => setUpdatedParent({ ...updatedParent, address: e.target.value })}
                />
              </label>
              <label>
                Occupation:
                <input
                  type="text"
                  value={updatedParent.occupation}
                  onChange={(e) => setUpdatedParent({ ...updatedParent, occupation: e.target.value })}
                />
              </label>
              <label>
                Relation Type:
                <input
                  type="text"
                  value={updatedParent.relationType}
                  onChange={(e) => setUpdatedParent({ ...updatedParent, relationType: e.target.value })}
                />
              </label>
              <button className="button-om" type="submit">Update Parent</button>
              <button className="button-om" type="button" onClick={() => setEditingParent(null)}>Cancel</button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default ParentList;
