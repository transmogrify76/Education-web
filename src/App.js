import React from 'react'; // Import React
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; // Import Router and necessary components
// Import your components
import Contactus from './components/Contactus/Contactus';
import Alogin from './components/Alogin/Alogin'
import Adminview from './components/Adminview/Adminview';
import Login from './components/Login/Login';
import Dashboard from './components/Dashboard/Dashboard';
// import Header from './components/Header/Header';
import Signup from './components/Signup/Signup';
// import Student from './components/Studentview/Student'
import ParentView from './components/Parentview/Parentview';
import Home from './components/Home/Home';
import Plogin from './components/Plogin/Plogin';
import Consent from './components/Consent/Consent';
import Reportc from './components/Reaportc/Reportc';
import ExternalR from './components/Externalr/Externalr';
import Tlogin from './components/Tlogin/Tlogin';
import Circular from './components/Circular/Circular';
import Calendar from './components/Calendar/Calendar';
import Leave from './components/Leave/Leave';
import Calen from './components/Calen/Calen'
import TimeTable from './components/TimeTable/TimeTable';
import TimeOffRequest from './components/TimeOffRequest/TimeOffRequest';
import Notification from './components/Notification/Notification';
import AttendancePage  from './components/AttendancePage/AttendancePage'
import Attendance   from './components/Attendance/Attendance'
import Infrastructure   from './components/Infrastructure/Infrastructure'
import  Event   from './components/Event/Event'
// import  curriculum   from './components/Curriculam/CurriculumPage'
import CurriculumPage from './components/Curriculam/CurriculumPage';
import AdminPage from './components/AdminPage/AdminPage';
import StudentRegisterPage from './components/StudentRegisterPage/StudentRegisterPage';
import ParentRegisterPage from './components/ParentRegisterPage/ParentRegisterPage';
import Medical from './components/Medical/Medical';
import AdminRegister from './components/AdminRegister/AdminRegister';
import AboutUs from './components/Aboutus/Aboutus';
import Award from './components/Award/Award'
import ForgetPassword from './components/ForgetPassword/ForgetPassword';
import ResetPassword from './components/ResetPassword/ResetPassword';
import TeacherRegister from './components/TeacherRegister/TeacherRegister'
import TransportRequest from './components/TransportRequest/TransportRequest'
import PaymentPage from './components/PaymentPage/PaymentPage'
import ParentProfilePage from './components/ParentProfilePage/ParentProfilePage'
<<<<<<< Updated upstream
import StudentProfilePage from './components/StudentProfilePage/StudentProfilePage';
import StudentIdCardPage from './components/StudentIdCardPage/StudentIdCardPage';
import CounselingRequest from './components/CounselingRequest/CounselingRequest';
import ExitSlipRequest from './components/ExitSlipRequest/ExitSlipRequest';
import ThirdPartyServices from './components/ThirdPartyServices/ThirdPartyServices';
import BehaviorAssessmentTool from './components/BehaviorAssessmentTool/BehaviorAssessmentTool';
import FeeReminderPage from './components/FeeReminderPage/FeeReminderPage';
=======
// import TeacherRegister from './components/TeacherRegister/TeacherRegister'
// App component
>>>>>>> Stashed changes
function App() {
  return (
    <Router>
      <div className="App">
        {/* <Header /> Render Header component */}
        <Routes>
          {/* Define your routes */}
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/contactus" element={<Contactus />} />
          <Route path="/adminview" element={<Adminview />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          
          {/* <Route path="/student" element={<Student />} /> */}
          
          <Route path="/parentview" element={<ParentView />} />
          <Route path="/plogin" element={<Plogin />} />
          <Route path="/dashboard/:parentId" element={<Dashboard />} />
          <Route path="/Alogin" element={<Alogin/>} />
          <Route path="/Consent" element={<Consent/>}/>
          <Route path="/Reportc" element={<Reportc/>}/>
          <Route path='/Externalr' element={<ExternalR/>}/>
          <Route path='/Tlogin' element={<Tlogin/>}/>
          <Route path='/Circular' element={<Circular/>}/>
          <Route path='/Calendar' element={<Calendar/>}/>
          <Route path='/Leave' element={<Leave/>}/>
          <Route path='/Calen' element={<Calen/>}/>
          <Route path='/TimeTable' element={<TimeTable/>}/>
          <Route path='/TimeOfRequest' element={<TimeOffRequest/>}/>
          <Route path='/Notification' element={<Notification/>}/>
          <Route path='/AttendancePage' element={<AttendancePage/>}/>
          <Route path='/Attendance' element={<Attendance/>}/>
          <Route path='/Infrastructure' element={<Infrastructure/>}/>
          <Route path='/Event' element={<Event/>}/>
          <Route path='/curriculum' element={<CurriculumPage/>}/>
          <Route path='/AdminPage' element={<AdminPage/>}/>
          <Route path='/StudentRegisterPage' element={<StudentRegisterPage/>}/>
          <Route path="/ParentRegisterpage" element={<ParentRegisterPage/>} />
          <Route path="/Medical" element={<Medical/>} />
          <Route path="/AdminRegister" element={<AdminRegister/>} />
          <Route path="/Aboutus" element={<AboutUs/>} />
          <Route path="/Award" element={<Award/>} />
          <Route path="/ForgetPassword" element={<ForgetPassword />} />
          <Route path="/ResetPassword" element={<ResetPassword />} />
          <Route path="/TeacherRegister" element={<TeacherRegister/>} />
          <Route path="/TransportRequest" element={<TransportRequest/>} />
          <Route path="/PaymentPage" element={<PaymentPage/>} />
          <Route path="/ParentProfilePage" element={<ParentProfilePage/>} />
<<<<<<< Updated upstream
          <Route path="/dashboard/:parentId" element={<Dashboard />} />
          <Route path="/ParentProfilePage/:parentId" element={<ParentProfilePage />} />
          <Route path='/StudentProfilePage' element={<StudentProfilePage/>}/>
          <Route path="/StudentProfilePage/:parentId" element={<StudentProfilePage />} />
          <Route path="/StudentIdCardPage/:parentId" element={<StudentIdCardPage />} />
          <Route path="/CounselingRequest" element={<CounselingRequest/>} />
          <Route path="/ExitSlipRequest" element={<ExitSlipRequest/>} />
          <Route path="/ThirdPartyServices" element={<ThirdPartyServices/>} />
          <Route path="/BehaviorAssessmentTool" element={<BehaviorAssessmentTool/>} />
          <Route path="/FeeReminderPage" element={<FeeReminderPage/>} />

          
=======
          {/* <Route path="/TeacherRegister" element={<TeacherRegister/>} /> */}
>>>>>>> Stashed changes



        </Routes>
      </div>
    </Router>
  );
}

export default App; // Export the App component



