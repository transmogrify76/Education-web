import React, { useState, useEffect } from "react";
import axios from "axios";
import "./TeacherAddSubjectPage.css";
import Header from '../Header/Header';

const TeacherAddSubjectPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneNo: "",
    address: "",
    gender: "",
    subjects: [],
  });

  const [newSubject, setNewSubject] = useState("");
  const [token, setToken] = useState(""); // Store the auth token here
  const [teachers, setTeachers] = useState([]); // Store the list of teachers
  const [selectedTeacherId, setSelectedTeacherId] = useState(""); // Store selected teacher ID

  // Fetch the token from localStorage when the component mounts
  useEffect(() => {
    const storedToken = localStorage.getItem("authToken");
    if (storedToken) {
      setToken(storedToken);
    } else {
      console.error("Authorization token missing");
    }

    // Fetch teachers list
    const fetchTeachers = async () => {
      try {
        const response = await fetch("http://localhost:3000/teacher");
        const data = await response.json();
        setTeachers(data); // Populate teachers list
      } catch (error) {
        console.error("Error fetching teachers:", error);
      }
    };

    fetchTeachers();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleAddSubject = () => {
    if (newSubject.trim() !== "") {
      setFormData((prevState) => ({
        ...prevState,
        subjects: [...prevState.subjects, newSubject],
      }));
      setNewSubject(""); // Reset input field
    }
  };

  const handleRemoveSubject = (subject) => {
    setFormData((prevState) => ({
      ...prevState,
      subjects: prevState.subjects.filter((s) => s !== subject),
    }));
  };

  const handleTeacherSelect = async (e) => {
    const selectedTeacherId = e.target.value;
    setSelectedTeacherId(selectedTeacherId);

    if (selectedTeacherId) {
      try {
        // Fetch the selected teacher's details
        const response = await axios.get(`http://localhost:3000/teacher/${selectedTeacherId}`);
        const selectedTeacher = response.data;

        // Update form data with the teacher's details
        setFormData({
          name: selectedTeacher.name,
          email: selectedTeacher.email,
          phoneNo: selectedTeacher.phoneNo,
          address: selectedTeacher.address,
          gender: selectedTeacher.gender,
          subjects: selectedTeacher.subjects || [],
        });
      } catch (error) {
        console.error("Error fetching teacher details:", error);
      }
    } else {
      // Reset form data if no teacher is selected
      setFormData({
        name: "",
        email: "",
        phoneNo: "",
        address: "",
        gender: "",
        subjects: [],
      });
    }
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
            Authorization: `Bearer ${token}`, // Include token in headers
          },
        }
      );
      alert("Teacher data updated successfully!");
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
          <select onChange={handleTeacherSelect} value={selectedTeacherId}>
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
          />
        </div>

        <div className="form-group">
          <label>Address:</label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleInputChange}
          />
        </div>

        <div className="form-group">
          <label>Gender:</label>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleInputChange}
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
          <input
            type="text"
            value={newSubject}
            onChange={(e) => setNewSubject(e.target.value)}
            placeholder="Add a subject"
          />
          <button type="button" onClick={handleAddSubject}>
            Add Subject
          </button>
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
