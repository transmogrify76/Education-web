import React, { useState, useEffect } from "react";

const TeacherAddSubjectPage = () => {
  const [teachers, setTeachers] = useState([]); // List of teachers
  const [selectedTeacherId, setSelectedTeacherId] = useState(""); // Selected teacher ID
  const [teacherDetails, setTeacherDetails] = useState(null); // Teacher details
  const [name, setName] = useState(""); // Teacher's name
  const [email, setEmail] = useState(""); // Teacher's email
  const [phoneNo, setPhoneNo] = useState(""); // Teacher's phone number
  const [address, setAddress] = useState(""); // Teacher's address
  const [gender, setGender] = useState(""); // Teacher's gender
  const [subjects, setSubjects] = useState([]); // List of subjects
  const [loading, setLoading] = useState(true); // Loading state
  const [token, setToken] = useState(null); // Token for authorization

  // Fetch token from localStorage when component mounts
  useEffect(() => {
    const storedToken = localStorage.getItem("authToken");
    setToken(storedToken);
  }, []);

  // Fetch teachers list when component mounts
  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const response = await fetch("http://localhost:3000/teacher");
        const data = await response.json();
        setTeachers(data); // Populate teacher list
      } catch (error) {
        console.error("Error fetching teachers:", error);
      }
    };

    fetchTeachers();
  }, []);

  // Fetch details for the selected teacher
  const fetchTeacherDetails = async (id) => {
    if (!id || !token) return; // Ensure token exists
    try {
      const response = await fetch(`http://localhost:3000/teacher/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setTeacherDetails(data);
      setName(data.name);
      setEmail(data.email);
      setPhoneNo(data.phoneNo);
      setAddress(data.address);
      setGender(data.gender);

      // Extract subject names from teacher's subjects array
      setSubjects(data.subjects.map((subject) => subject.name));

      setLoading(false);
    } catch (error) {
      console.error("Error fetching teacher details:", error);
    }
  };

  // Handle teacher selection from dropdown
  const handleTeacherSelect = (e) => {
    const selectedId = e.target.value;
    setSelectedTeacherId(selectedId);
    fetchTeacherDetails(selectedId);
  };

  // Handle input change in the form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "subjects") {
      setSubjects(value.split(",").map((subject) => subject.trim()));
    } else {
      switch (name) {
        case "name":
          setName(value);
          break;
        case "email":
          setEmail(value);
          break;
        case "phoneNo":
          setPhoneNo(value);
          break;
        case "address":
          setAddress(value);
          break;
        case "gender":
          setGender(value);
          break;
        default:
          break;
      }
    }
  };

  // Handle form submission to update teacher details
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
      alert("No token available");
      return;
    }

    // Sanitize name input to ensure it's a valid string before trimming
    const sanitizedName = typeof name === "string" ? name.trim() : "";

    if (!sanitizedName) {
      alert("Please enter a valid name");
      return;
    }

    // Prepare updated teacher data
    const updatedSubjects = subjects.map((subject) => ({
      name: subject, // Assuming subjects are simple strings
    }));

    const updatedTeacherData = {
      name: sanitizedName,
      email,
      phoneNo,
      address,
      gender,
      subjects: updatedSubjects,
    };

    // Send updated data to backend
    try {
      const response = await fetch(`http://localhost:3000/teacher/${selectedTeacherId}`, {
        method: "PATCH",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedTeacherData),
      });

      if (response.ok) {
        alert("Teacher details updated successfully");
      } else {
        const errorData = await response.json();
        alert(`Failed to update teacher details: ${errorData.message}`);
      }
    } catch (error) {
      console.error("Error updating teacher details:", error);
    }
  };

  return (
    <div>
      <h2>Update Teacher Details</h2>

      <label htmlFor="teacherSelect">Select Teacher:</label>
      <select id="teacherSelect" value={selectedTeacherId} onChange={handleTeacherSelect}>
        <option value="">--Select Teacher--</option>
        {teachers.map((teacher) => (
          <option key={teacher.id} value={teacher.id}>
            {teacher.name}
          </option>
        ))}
      </select>

      {loading ? (
        <p>Loading teacher details...</p>
      ) : teacherDetails ? (
        <form onSubmit={handleSubmit}>
          <h3>Update Teacher Information</h3>

          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={name}
            onChange={handleInputChange}
            required
          />
          <br />
          <br />

          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={handleInputChange}
            required
          />
          <br />
          <br />

          <label htmlFor="phoneNo">Phone No:</label>
          <input
            type="text"
            id="phoneNo"
            name="phoneNo"
            value={phoneNo}
            onChange={handleInputChange}
            required
          />
          <br />
          <br />

          <label htmlFor="address">Address:</label>
          <input
            type="text"
            id="address"
            name="address"
            value={address}
            onChange={handleInputChange}
            required
          />
          <br />
          <br />

          <label htmlFor="gender">Gender:</label>
          <select
            id="gender"
            name="gender"
            value={gender}
            onChange={handleInputChange}
            required
          >
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
          <br />
          <br />

          <label htmlFor="subjects">Subjects:</label>
          <input
            type="text"
            id="subjects"
            name="subjects"
            value={subjects.join(", ")} // Join subjects as a string
            onChange={handleInputChange}
            required
          />
          <br />
          <br />

          <button type="submit">Update Teacher</button>
        </form>
      ) : (
        <p>No teacher details available</p>
      )}
    </div>
  );
};

export default TeacherAddSubjectPage;
