import React from 'react'; 
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

// Import your components
import Contactus from './components/Contactus/Contactus';
import Alogin from './components/Alogin/Alogin';
import Adminview from './components/Adminview/Adminview';
import Login from './components/Login/Login';
import Dashboard from './components/Dashboard/Dashboard';
import Signup from './components/Signup/Signup';
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
import Calen from './components/Calen/Calen';
import TimeTable from './components/TimeTable/TimeTable';
import TimeOffRequest from './components/TimeOffRequest/TimeOffRequest';
import Notification from './components/Notification/Notification';
import AttendancePage from './components/AttendancePage/AttendancePage';
import Attendance from './components/Attendance/Attendance';
import Infrastructure from './components/Infrastructure/Infrastructure';
import Event from './components/Event/Event';
import CurriculumPage from './components/Curriculam/CurriculumPage';
import AdminPage from './components/AdminPage/AdminPage';
import StudentRegisterPage from './components/StudentRegisterPage/StudentRegisterPage';
import ParentRegisterPage from './components/ParentRegisterPage/ParentRegisterPage';
import Medical from './components/Medical/Medical';
import AdminRegister from './components/AdminRegister/AdminRegister';
import AboutUs from './components/Aboutus/Aboutus';
import Award from './components/Award/Award';
import ForgetPassword from './components/ForgetPassword/ForgetPassword';
import ResetPassword from './components/ResetPassword/ResetPassword';
import TeacherRegister from './components/TeacherRegister/TeacherRegister';
import TransportRequest from './components/TransportRequest/TransportRequest';
import PaymentPage from './components/PaymentPage/PaymentPage';
import ParentProfilePage from './components/ParentProfilePage/ParentProfilePage';
import StudentProfilePage from './components/StudentProfilePage/StudentProfilePage';
import StudentIdCardPage from './components/StudentIdCardPage/StudentIdCardPage';
import CounselingRequest from './components/CounselingRequest/CounselingRequest';
import ExitSlipRequest from './components/ExitSlipRequest/ExitSlipRequest';
import ThirdPartyServices from './components/ThirdPartyServices/ThirdPartyServices';
import BehaviorAssessmentTool from './components/BehaviorAssessmentTool/BehaviorAssessmentTool';
import FeeReminderPage from './components/FeeReminderPage/FeeReminderPage';
import ClubPage from './components/ClubPage/ClubPage';
import ClubPaymentPage from './components/ClubPaymentPage/ClubPaymentPage';
import AdminTimeTable from './components/AdminTimeTable/AdminTimeTable';
import UpdateTc from './components/UpdateTc/UpdateTc';
import ExitSlipUpdate from './components/ExitSlipUpdate/ExitSlipUpdate';
import TransportRequestUpdatePage from './components/TransportRequestUpdatePage/TransportRequestUpdatePage';
import ThirdPartyServicesUpdatePage from './components/ThirdPartyServicesUpdatePage/ThirdPartyServicesUpdatePage';
import NotificationPage from './components/NotificationPage/NotificationPage';
import UpdateLeaveStatus from './components/UpdateLeaveStatus/UpdateLeaveStatus';

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
          <Route path="/parentview" element={<ParentView />} />
          <Route path="/plogin" element={<Plogin />} />
          <Route path="/dashboard/:parentId" element={<Dashboard />} />
          <Route path="/Alogin" element={<Alogin />} />
          <Route path="/Consent/:parentid" element={<Consent />} />
          <Route path="/Reportc" element={<Reportc />} />
          <Route path='/Externalr' element={<ExternalR />} />
          <Route path='/Tlogin' element={<Tlogin />} />
          <Route path='/Circular' element={<Circular />} />
          <Route path='/Calendar' element={<Calendar />} />
          <Route path='/Leave' element={<Leave />} />
          <Route path='/Calen' element={<Calen />} />
          <Route path='/TimeTable/:parentId' element={<TimeTable />} />
          <Route path='/TimeOfRequest/:parentId' element={<TimeOffRequest />} />
          <Route path='/Notification' element={<Notification />} />
          <Route path='/AttendancePage' element={<AttendancePage />} />
          <Route path='/Attendance' element={<Attendance />} />
          <Route path='/Infrastructure' element={<Infrastructure />} />
          <Route path="/event/:id" element={<Event />} />
          <Route path="/event" element={<Event />} />
          <Route path='/curriculum' element={<CurriculumPage />} />
          <Route path='/AdminPage' element={<AdminPage />} />
          <Route path='/StudentRegisterPage' element={<StudentRegisterPage />} />
          <Route path="/ParentRegisterpage" element={<ParentRegisterPage />} />
          <Route path="/Medical" element={<Medical />} />
          <Route path="/AdminRegister" element={<AdminRegister />} />
          <Route path="/Aboutus" element={<AboutUs />} />
          <Route path="/Award" element={<Award />} />
          <Route path="/ForgetPassword" element={<ForgetPassword />} />
          <Route path="/ResetPassword" element={<ResetPassword />} />
          <Route path="/TeacherRegister" element={<TeacherRegister />} />
          <Route path="/TransportRequest" element={<TransportRequest />} />
          <Route path="/PaymentPage" element={<PaymentPage />} />
          <Route path="/ParentProfilePage" element={<ParentProfilePage />} />
          <Route path="/ParentProfilePage/:parentId" element={<ParentProfilePage />} />
          <Route path='/StudentProfilePage' element={<StudentProfilePage />} />
          <Route path="/StudentProfilePage/:parentId" element={<StudentProfilePage />} />
          <Route path="/StudentIdCardPage/:parentId" element={<StudentIdCardPage />} />
          <Route path="/CounselingRequest" element={<CounselingRequest />} />
          <Route path="/ExitSlipRequest/:parentId" element={<ExitSlipRequest />} />
          <Route path="/ThirdPartyServices/:parentId" element={<ThirdPartyServices />} />
          <Route path="/BehaviorAssessmentTool" element={<BehaviorAssessmentTool />} />
          <Route path="/FeeReminderPage/:parentId" element={<FeeReminderPage />} />
          <Route path="/ClubPage" element={<ClubPage />} />
          <Route path="/ClubPaymentPage" element={<ClubPaymentPage />} />
          <Route path="/payment/:clubId" element={<ClubPaymentPage />} />
          <Route path='/AdminTimeTable' element={<AdminTimeTable/>}/>
          <Route path='/UpdateTc' element={<UpdateTc/>}/>
          <Route path='/ExitSlipUpdate' element={<ExitSlipUpdate/>}/>
          <Route path='/TransportRequestUpdatePage' element={<TransportRequestUpdatePage/>}/>
          <Route path='/ThirdPartyServicesUpdatePage' element={<ThirdPartyServicesUpdatePage/>}/>
          <Route path='/NotificationPage' element={<NotificationPage/>}/>
          <Route path='/UpdateLeaveStatus' element={<UpdateLeaveStatus/>}/>          

        </Routes>
      </div>
    </Router>
  );
}

export default App; // Export the App component
