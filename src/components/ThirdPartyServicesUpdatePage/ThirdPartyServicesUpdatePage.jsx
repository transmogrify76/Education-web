import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ThirdPartyServicesUpdatePage.css';
import Header from '../Header/Header';

const ThirdPartyServicesUpdatePage = () => {
  const [services, setServices] = useState([]);
  const [statusUpdate, setStatusUpdate] = useState({});

  useEffect(() => {
    axios.get('http://192.168.0.103:3000/third-party-services')
      .then(response => {
        const sortedServices = response.data.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
        setServices(sortedServices);
      })
      .catch(error => {
        console.error('Error fetching third-party services:', error);
      });
  }, []);

  const handleStatusChange = (id, studentName, email, phoneNo, selectedServices, status) => {
    axios.patch(`http://192.168.0.103:3000/third-party-services/${id}`, {
      studentName,
      email,
      phoneNo,
      selectedServices,
      status
    })
    .then(response => {
      console.log('Status updated:', response.data); // Log response for debugging
      setStatusUpdate(prevState => ({ ...prevState, [id]: status }));
    })
    .catch(error => {
      console.error('Error updating status:', error);
    });
  };

  return (
    <div>
      <Header/>
    <div className="third-party-services-page">
      <h2>Third-Party Services Management</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Student Name</th>
            <th>Parent Email</th>
            <th>Parent Phone No</th>
            <th>Selected Services</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {services.map(service => (
            <tr key={service.id}>
              <td>{service.id}</td>
              <td>{service.studentName}</td>
              <td>{service.email}</td>
              <td>{service.phoneNo}</td>
              <td>{service.selectedServices.join(', ')}</td>
              <td className={`status ${statusUpdate[service.id] || service.status}`}>
                {statusUpdate[service.id] || service.status}
              </td>
              <td>
                {(statusUpdate[service.id] === 'Approved' || statusUpdate[service.id] === 'Rejected' || service.status === 'Approved' || service.status === 'Rejected') ? null : (
                  <>
                    <div 
                      className="action approve" 
                      onClick={() => handleStatusChange(service.id, service.studentName, service.email, service.phoneNo, service.selectedServices, 'Approved')}
                    >
                      Approve
                    </div>
                    <div 
                      className="action reject" 
                      onClick={() => handleStatusChange(service.id, service.studentName, service.email, service.phoneNo, service.selectedServices, 'Rejected')}
                    >
                      Reject
                    </div>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    </div>
  );
};

export default ThirdPartyServicesUpdatePage;
