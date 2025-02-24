import React, { useState, useEffect } from "react";
import axios from "axios";
import './TeacherAddSubjectPage.css'; // Assuming you will add this CSS file
import Header from '../Header/Header';

const TeacherAddSubjectPage = () => {
  const [teachers, setTeachers] = useState([]);
  const [selectedTeacherId, setSelectedTeacherId] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneNo: "",
    address: "",
    gender: "",
    subjects: [],
  });
  const [newSubject, setNewSubject] = useState("");
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("authToken");
    setToken(storedToken);
  }, []);

  const fetchTeachers = async () => {
    try {
      const response = await fetch("http://localhost:3000/teacher");
      const data = await response.json();
      setTeachers(data);
    } catch (error) {
      console.error("Error fetching teachers:", error);
    }
  };

  useEffect(() => {
    fetchTeachers();
  }, []);

  const fetchTeacherDetails = async (id) => {
    if (!id || !token) return;
    try {
      const response = await fetch(`http://localhost:3000/teacher/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
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

  const handleTeacherSelect = (e) => {
    const selectedId = e.target.value;
    setSelectedTeacherId(selectedId);
    fetchTeacherDetails(selectedId);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleAddSubject = () => {
    if (newSubject.trim() !== "") {
      setFormData((prevData) => ({
        ...prevData,
        subjects: [...prevData.subjects, newSubject.trim()],
      }));
      setNewSubject("");
    }
  };

  const handleRemoveSubject = (subjectToRemove) => {
    setFormData((prevData) => ({
      ...prevData,
      subjects: prevData.subjects.filter((subject) => subject !== subjectToRemove),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
      alert("Authorization token is missing. Please log in.");
      return;
    }

    try {
      const response = await axios.patch(
        `http://localhost:3000/teacher/${selectedTeacherId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert("Teacher data updated successfully!");
      fetchTeachers();
    } catch (error) {
      console.error("Error updating teacher:", error);
      alert("There was an error updating the teacher data.");
    }
  };

  return (
    <div>
      <Header/>
    <div className="teacher-add-subject-page">
      <h2>Update Teacher Information</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Select Teacher:</label>
          <select
            onChange={handleTeacherSelect}
            value={selectedTeacherId}
            className="form-control"
          >
            <option value="">Select Teacher</option>
            {teachers.map((teacher) => (
              <option key={teacher.id} value={teacher.id}>
                {teacher.name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Name:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            disabled
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
            disabled
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
            disabled
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
            <input
              type="text"
              value={newSubject}
              onChange={(e) => setNewSubject(e.target.value)}
              placeholder="Add a subject"
              className="form-control"
            />
            <button type="button" onClick={handleAddSubject} className="btn-add">
              Add Subject
            </button>
          </div>
        </div>

        <button type="submit" className="submit-btn">
          Update Teacher
        </button>
      </form>
    </div>
    </div>
  );
};

export default TeacherAddSubjectPage;
