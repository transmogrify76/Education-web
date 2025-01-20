// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import './ParentRegisterPage.css';
// import Header from '../Header/Header';

// const ParentRegisterPage = () => {
//     const [formData, setFormData] = useState({
//         name: '',
//         studentName: '',
//         email: '',
//         phoneNo: '',
//         address: '',
//         password: '',
//         roleType: 'parent', // Ensure this matches your API expectations
//         relationType: '', // Changed from 'relation' to 'relationType'
//         occupation: '', // Optional field for occupation
//     });

//     const [message, setMessage] = useState('');
//     const [showPopup, setShowPopup] = useState(false);
//     const navigate = useNavigate(); // Initialize useNavigate

//     const handleChange = (e) => {
//         const { name, value } = e.target;
//         setFormData({
//             ...formData,
//             [name]: value,
//         });
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();

//         try {
//             const response = await fetch('http://localhost:3000/parent/register', {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify({
//                     name: formData.name,
//                     studentName: formData.studentName,
//                     email: formData.email,
//                     phoneNo: formData.phoneNo,
//                     address: formData.address,
//                     password: formData.password,
//                     roleType: formData.roleType,
//                     relationType: formData.relationType, // Ensure this matches the backend
//                     occupation: formData.occupation, // Optional field for occupation
//                 }),
//             });

//             if (response.ok) {
//                 const responseData = await response.json();
//                 const parentId = responseData.id; // Assuming API response contains `id`

//                 setShowPopup(true);
//                 setTimeout(() => {
//                     setShowPopup(false);
//                     navigate(`/plogin?parentId=${parentId}`); // Redirect to Plogin with parentId
//                 }, 2000); // Adjust the delay as needed
//             } else {
//                 const errorData = await response.json();
//                 setMessage(`Registration failed: ${errorData.message}`);
//             }
//         } catch (error) {
//             console.error('Fetch error:', error);
//             setMessage(`Error: ${error.message}`);
//         }
//     };

//     return (
//         <div>
//             <Header />
//             <div className="register-page-containers">
//                 <form className="register-forms" onSubmit={handleSubmit}>
//                     <h1 className="register-title">Parent Registration</h1>
//                     <label>
//                         Name:
//                         <input
//                             type="text"
//                             name="name"
//                             value={formData.name}
//                             onChange={handleChange}
//                             required
//                         />
//                     </label>
//                     <label>
//                         Student Name:
//                         <input
//                             type="text"
//                             name="studentName"
//                             value={formData.studentName}
//                             onChange={handleChange}
//                             required
//                         />
//                     </label>
//                     <label>
//                         Email:
//                         <input
//                             type="email"
//                             name="email"
//                             value={formData.email}
//                             onChange={handleChange}
//                             required
//                         />
//                     </label>
//                     <label>
//                         Phone Number:
//                         <input
//                             type="tel"
//                             name="phoneNo"
//                             value={formData.phoneNo}
//                             onChange={handleChange}
//                             required
//                         />
//                     </label>
//                     <label>
//                         Address:
//                         <input
//                             type="text"
//                             name="address"
//                             value={formData.address}
//                             onChange={handleChange}
//                             required
//                         />
//                     </label>
//                     <label>
//                         Relation (to student):
//                         <input
//                             type="text"
//                             name="relationType" // Ensure the name matches the backend field
//                             value={formData.relationType}
//                             onChange={handleChange}
//                             required
//                         />
//                     </label>
//                     <label>
//                         Occupation:
//                         <input
//                             type="text"
//                             name="occupation"
//                             value={formData.occupation}
//                             onChange={handleChange}
//                             // Occupation is optional
//                         />
//                     </label>
//                     <label>
//                         Password:
//                         <input
//                             type="password"
//                             name="password"
//                             value={formData.password}
//                             onChange={handleChange}
//                             required
//                         />
//                     </label>
//                     <button type="submit" className="submit-button">Register</button>
//                 </form>
//                 {showPopup && (
//                     <div className="popup">
//                         <span className="popup-icon">✔</span>
//                         <span className="popup-message">Parent registered successfully!</span>
//                     </div>
//                 )}
//                 {message && <p className="message">{message}</p>}
//             </div>
//         </div>
//     );
// };

// export default ParentRegisterPage;


import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ParentRegisterPage.css';
import Header from '../Header/Header';

const ParentRegisterPage = () => {
    const [formData, setFormData] = useState({
        name: '',
        studentName: '',
        email: '',
        phoneNo: '',
        address: '',
        password: '',
        roleType: 'parent', // Ensure this matches your API expectations
        relationType: '', // Changed from 'relation' to 'relationType'
        occupation: '', // Optional field for occupation
    });

    const [message, setMessage] = useState('');
    const [showPopup, setShowPopup] = useState(false);
    const navigate = useNavigate(); // Initialize useNavigate

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Retrieve the token from localStorage
        const token = localStorage.getItem('authToken');

        // Check if the token exists, else show an error message
        if (!token) {
            setMessage('Authorization token not found. Please log in as an admin.');
            return;
        }

        try {
            const response = await fetch('http://localhost:3000/parent/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`, // Add the token in the Authorization header
                },
                body: JSON.stringify({
                    name: formData.name,
                    studentName: formData.studentName,
                    email: formData.email,
                    phoneNo: formData.phoneNo,
                    address: formData.address,
                    password: formData.password,
                    roleType: formData.roleType,
                    relationType: formData.relationType, // Ensure this matches the backend
                    occupation: formData.occupation, // Optional field for occupation
                }),
            });

            if (response.ok) {
                const responseData = await response.json();
                const parentId = responseData.id; // Assuming API response contains `id`

                setShowPopup(true);
                setTimeout(() => {
                    setShowPopup(false);
                    navigate(`/plogin`); // Redirect to Plogin with parentId
                }, 2000); // Adjust the delay as needed
            } else {
                const errorData = await response.json();
                setMessage(`Registration failed: ${errorData.message}`);
            }
        } catch (error) {
            console.error('Fetch error:', error);
            setMessage(`Error: ${error.message}`);
        }
    };

    return (
        <div>
            <Header />
            <div className="register-page-containers">
                <form className="register-forms" onSubmit={handleSubmit}>
                    <h1 className="register-title">Parent Registration</h1>
                    <label>
                        Name:
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    </label>
                    <label>
                        Student Name:
                        <input
                            type="text"
                            name="studentName"
                            value={formData.studentName}
                            onChange={handleChange}
                            required
                        />
                    </label>
                    <label>
                        Email:
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </label>
                    <label>
                        Phone Number:
                        <input
                            type="tel"
                            name="phoneNo"
                            value={formData.phoneNo}
                            onChange={handleChange}
                            required
                        />
                    </label>
                    <label>
                        Address:
                        <input
                            type="text"
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            required
                        />
                    </label>
                    <label>
                        Relation (to student):
                        <input
                            type="text"
                            name="relationType" // Ensure the name matches the backend field
                            value={formData.relationType}
                            onChange={handleChange}
                            required
                        />
                    </label>
                    <label>
                        Occupation:
                        <input
                            type="text"
                            name="occupation"
                            value={formData.occupation}
                            onChange={handleChange}
                            // Occupation is optional
                        />
                    </label>
                    <label>
                        Password:
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </label>
                    <button type="submit" className="submit-button">Register</button>
                </form>
                {showPopup && (
                    <div className="popup">
                        <span className="popup-icon">✔</span>
                        <span className="popup-message">Parent registered successfully!</span>
                    </div>
                )}
                {message && <p className="message">{message}</p>}
            </div>
        </div>
    );
};

export default ParentRegisterPage;

