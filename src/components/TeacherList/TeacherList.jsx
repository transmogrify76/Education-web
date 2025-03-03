import React, { useState, useEffect } from 'react';
import './TeacherList.css';
import Header from '../Header/Header';
import axios from 'axios';

const TeacherList = () => {
  const [teachers, setTeachers] = useState([]);  // Store all teachers
  const [classes, setClasses] = useState([]);    // Store class data
  const [selectedClassId, setSelectedClassId] = useState('');  // Store selected class ID
  const [filteredTeachers, setFilteredTeachers] = useState([]);  // Store filtered teachers based on class
  const [selectedTeacherId, setSelectedTeacherId] = useState('');  // Store selected teacher ID for editing
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneNo: "",
    address: "",
    gender: "",
    subjects: [],
  });
  const [showEditModal, setShowEditModal] = useState(false);  // Flag to show/hide edit modal
  const [loading, setLoading] = useState(true);  // Flag to indicate data loading status

  // Get the authToken from localStorage
  const authToken = localStorage.getItem('authToken');  // Make sure the token is in the localStorage

  // Fetching teachers data from API
  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const response = await fetch('http://192.168.0.103:3000/teacher', {
          headers: {
            'Authorization': `Bearer ${authToken}`,  // Add token to Authorization header
          },
        });
        const data = await response.json();
        setTeachers(data);  // Populate teachers list
      } catch (error) {
        console.error('Error fetching teachers:', error);
      }
    };

    fetchTeachers();
  }, [authToken]);

  // Fetching class data from API
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const response = await fetch('http://192.168.0.103:3000/class', {
          headers: {
            'Authorization': `Bearer ${authToken}`,  // Add token to Authorization header
          },
        });
        const data = await response.json();
        setClasses(data);  // Populate class list
      } catch (error) {
        console.error('Error fetching classes:', error);
      }
    };

    fetchClasses();
  }, [authToken]);

  // Handle class selection and filter teachers based on the selected class
  const handleClassChange = (e) => {
    const classId = e.target.value;
    setSelectedClassId(classId);

    if (classId) {
      // Fetch teachers for the selected class from the API
      const fetchTeachersForClass = async () => {
        try {
          const response = await fetch(`http://192.168.0.103:3000/teacher/class/${classId}`, {
            headers: {
              'Authorization': `Bearer ${authToken}`,  // Add token to Authorization header
            },
          });

          const data = await response.json();
          console.log('Teachers for selected class:', data);  // Log response data
          setFilteredTeachers(data.teachers);  // Populate filtered teachers based on the selected class
        } catch (error) {
          console.error('Error fetching teachers by class:', error);
        }
      };

      fetchTeachersForClass();
    } else {
      setFilteredTeachers([]);  // If no class is selected, show no filtered teachers
    }
  };

  // Handle Delete Teacher action
  const handleDeleteTeacher = async (teacherId) => {
    try {
      await fetch(`http://192.168.0.103:3000/teacher/${teacherId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${authToken}`,  // Add token to Authorization header
        },
      });
      setTeachers(teachers.filter(teacher => teacher.id !== teacherId));  // Update the UI
      alert('Teacher deleted successfully');
    } catch (error) {
      console.error('Error deleting teacher:', error);
    }
  };

  // Fetch teacher details for editing
  const fetchTeacherDetails = async (id) => {
    if (!id || !authToken) return;
    try {
      const response = await fetch(`http://192.168.0.103:3000/teacher/${id}`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      const data = await response.json();
      setFormData({
        name: data.name || "",
        email: data.email || "",
        phoneNo: data.phoneNo || "",
        address: data.address || "",
        gender: data.gender || "",
        subjects: data.subjects.map((subject) => subject.name) || [],
      });
      setLoading(false);
    } catch (error) {
      console.error("Error fetching teacher details:", error);
    }
  };

  // Handle Edit Teacher action
  const handleEditTeacher = (teacherId) => {
    setSelectedTeacherId(teacherId);
    fetchTeacherDetails(teacherId);
    setShowEditModal(true);
  };

  // Handle input changes in the edit form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle adding a new subject
  const handleAddSubject = () => {
    const newSubject = prompt("Enter a new subject");
    if (newSubject && newSubject.trim() !== "") {
      setFormData((prevData) => ({
        ...prevData,
        subjects: [...prevData.subjects, newSubject.trim()],
      }));
    }
  };

  // Handle removing a subject
  const handleRemoveSubject = (subjectToRemove) => {
    setFormData((prevData) => ({
      ...prevData,
      subjects: prevData.subjects.filter((subject) => subject !== subjectToRemove),
    }));
  };

  // Handle submitting the edit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!authToken) {
      alert("Authorization token is missing. Please log in.");
      return;
    }

    try {
      const response = await axios.patch(
        `http://192.168.0.103:3000/teacher/${selectedTeacherId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      alert("Teacher data updated successfully!");

      // Update the teachers list
      const updatedTeachers = teachers.map(teacher => {
        if (teacher.id === selectedTeacherId) {
          return {
            ...teacher,
            name: formData.name,
            email: formData.email,
            phoneNo: formData.phoneNo,
            address: formData.address,
            gender: formData.gender,
            subjects: formData.subjects.map(subject => ({ name: subject })),
          };
        }
        return teacher;
      });
      setTeachers(updatedTeachers);

      // Update filtered teachers if applicable
      if (filteredTeachers.length > 0) {
        const updatedFilteredTeachers = filteredTeachers.map(teacher => {
          if (teacher.id === selectedTeacherId) {
            return {
              ...teacher,
              name: formData.name,
              email: formData.email,
              phoneNo: formData.phoneNo,
              address: formData.address,
              gender: formData.gender,
              subjects: formData.subjects.map(subject => ({ name: subject })),
            };
          }
          return teacher;
        });
        setFilteredTeachers(updatedFilteredTeachers);
      }

      setShowEditModal(false);
    } catch (error) {
      console.error("Error updating teacher:", error);
      alert("There was an error updating the teacher data.");
    }
  };

  return (
    <div>
      <Header />
      <div className="teacher-list-container">
        <h1>Teacher List</h1>

        {/* Class Selection Dropdown */}
        <div className="class-dropdown">
          <label htmlFor="classId">Select Class:</label>
          <select
            id="classId"
            value={selectedClassId}
            onChange={handleClassChange}
          >
            <option value="">Select a Class</option>
            {classes.map((classItem) => (
              <option key={classItem.id} value={classItem.id}>
                {classItem.className}
              </option>
            ))}
          </select>
        </div>

        {/* All Teachers Table */}
        <div className="teacher-table-container">
          <h2>All Teachers</h2>
          <table className="teacher-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Subjects</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {teachers.length > 0 ? (
                teachers.map((teacher) => (
                  <tr key={teacher.id}>
                    <td>{teacher.name}</td>
                    <td>{teacher.email}</td>
                    <td>
                      {teacher.subjects.map(subject => subject.name).join(', ')}
                    </td>
                    <td>
                      <button onClick={() => handleEditTeacher(teacher.id)}>Edit</button>
                      <button onClick={() => handleDeleteTeacher(teacher.id)}>Delete</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4">No teachers available.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Classwise Teachers Table */}
        {selectedClassId && (
          <div className="teacher-table-container">
            <h2>Teachers for Selected Class</h2>
            <table className="teacher-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Subjects</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredTeachers.length > 0 ? (
                  filteredTeachers.map((teacher) => (
                    <tr key={teacher.id}>
                      <td>{teacher.name}</td>
                      <td>{teacher.email}</td>
                      <td>
                        {teacher.subjects.map(subject => subject.name).join(', ')}
                      </td>
                      <td>
                        <button onClick={() => handleEditTeacher(teacher.id)}>Edit</button>
                        <button onClick={() => handleDeleteTeacher(teacher.id)}>Delete</button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4">No teachers available for the selected class.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Edit Teacher Modal */}
        {showEditModal && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h2>Edit Teacher Information</h2>
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Name:</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="form-control"
                  />
                </div>

                <div className="form-group">
                  <label>Email:</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="form-control"
                  />
                </div>

                <div className="form-group">
                  <label>Phone No:</label>
                  <input
                    type="text"
                    name="phoneNo"
                    value={formData.phoneNo}
                    onChange={handleInputChange}
                    className="form-control"
                  />
                </div>

                <div className="form-group">
                  <label>Address:</label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="form-control"
                  />
                </div>

                <div className="form-group">
                  <label>Gender:</label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    className="form-control"
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Subjects:</label>
                  <div className="subjects-container">
                    {formData.subjects.map((subject, index) => (
                      <div className="subject-item" key={index}>
                        <span>{subject}</span>
                        <button
                          type="button"
                          className="remove-subject"
                          onClick={() => handleRemoveSubject(subject)}
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="add-subject-container">
                    <button type="button" onClick={handleAddSubject} className="btn-add">
                      Add Subject
                    </button>
                  </div>
                </div>

                <button type="submit" className="submit-btn">
                  Update Teacher
                </button>
                <button type="button" className="cancel-btn" onClick={() => setShowEditModal(false)}>
                  Cancel
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TeacherList;
