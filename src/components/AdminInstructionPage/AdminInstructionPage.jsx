import React from 'react';
import './AdminInstructionPage.css';
import { useNavigate } from 'react-router-dom';

function AdminInstructionPage() {
  const navigate = useNavigate();
  return (
    <div className="instruction-page">
      <h1>📘 Admin Dashboard Instructions</h1>
      <ul>
        <li>
          <strong>👨‍👩‍👧 Parent Registration:</strong>
          First, register the parent by entering details such as name, email, and contact information. After the parent is registered, register the student, associating them with the parent by using the parent’s email ID. This way, the system can link the parent to one or more students (father/mother).
        </li>
        <li>
          <strong>👦 Student Registration:</strong>
          Once the parent is registered, input the student's information, such as name, date of birth, class, and any other relevant details. Make sure to associate the student with the correct parent through the email ID.
        </li>
        <li>
          <strong>👩‍🏫 Teacher Registration:</strong>
          Before registering a teacher, check the subject and ensure that the subject is linked to the correct class in the Subject Management section. After verifying, you can register the teacher and assign them to the relevant subjects.
        </li>
        <li>
          <strong>📚 Class Management:</strong>
          If a new class needs to be created, this section allows you to create a class and assign a teacher to it. If the class already exists, you can select the teacher and update the class accordingly.
        </li>
        <li>
          <strong>👨‍🎓 Student List:</strong>
          View the student list in this section. You can also update the student's details if needed, such as upgrading the class or making other necessary changes.
        </li>
        <li>
          <strong>👩‍👩‍👦 Parent Management:</strong>
          View and edit parent details in this section. If any updates are needed for the registered parents, you can modify their information here.
        </li>
        <li>
          <strong>👩‍🏫 Teacher List:</strong>
          View the teacher list and edit any teacher’s details. If necessary, you can update the teacher's information, such as class assignments or subject details.
        </li>
        <li>
          <strong>📝 Subject Management:</strong>
          This section handles subject creation, linking subjects to specific classes, and assigning them to teachers. Ensure that subjects are correctly linked before assigning teachers.
        </li>
        <li>
          <strong>📅 Time Table Posting:</strong>
          Admins can post the student timetable for each class. This can include subjects, class timings, and other related details.
        </li>
        <li>
          <strong>🔄 Transfer Request Management:</strong>
          Admin can view transfer requests and approve or decline them as necessary.
        </li>
        <li>
          <strong>📝 Exit Slip Request Management:</strong>
          This section allows admins to manage and update exit slip requests for students. Admins can approve or decline requests here.
        </li>
        <li>
          <strong>🚗 Transport Request Management:</strong>
          View and update the transport request status for students. Admins can approve, decline, or modify the request status.
        </li>
        <li>
          <strong>⚙️ Third-Party Services Management:</strong>
          Admins can manage third-party services such as meal plans or other services. This section allows for the approval or denial of such requests.
        </li>
      </ul>
    </div>
    
  );
}

export default AdminInstructionPage;
