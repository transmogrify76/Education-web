import React from 'react'; 
import '@fortawesome/fontawesome-free/css/all.min.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

// Import your components
import Contactus from './components/Contactus/Contactus';
import Alogin from './components/Alogin/Alogin';
import Adminview from './components/Adminview/Adminview';
import Login from './components/Login/Login';
import Dashboard from './components/Dashboard/Dashboard';
import ParentDashboard from './components/Dashboard/Dashboard';
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
import AdminDashboard from './components/AdminPage/AdminPage';
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
import ConsentFormPage from './components/ConsentFormPage/ConsentFormPage';
import StudentView from './components/StudentView/Student';
import SideNav from './components/SideNav/SideNav';
import GoalsSettingInternalExam from './components/GoalsSettingInternalExam/GoalsSettingInternalExam';
import GoalSettingView from './components/GoalSettingView/GoalSettingView';
import ExternalReport from './components/ExternalReport/ExternalReport';
import ThirdPartyServicesStudent from './components/ThirdPartyServicesStudent/ThirdPartyServicesStudent';
import StudentWellbeingForm from './components/StudentWellbeingForm/StudentWellbeingForm';
import Chatbot from './components/Chatbot/Chatbot-Transmogrify_18'
import AdminWellbeingRequests from './components/AdminWellbeingRequests/AdminWellbeingRequests'
import AdminBehaviorAssessment from './components/AdminBehaviorAssessment/AdminBehaviorAssessment'
import BehaviorAssessmentPage from './components/BehaviorAssessmentPage/BehaviorAssessmentPage'
import AdminChat from './components/AdminChat/AdminChat'
import TeacherDashboard from './components/TeacherDashboard/TeacherDashboard'
import ClassManagementPage from './components/ClassManagementPage/ClassManagementPage'
import AdminClassManagementPage from './components/AdminClassManagementPage/AdminClassManagementPage'
import TeacherStudentManagementPage from './components/TeacherStudentManagementPage/TeacherStudentManagementPage'
import UploadResults from './components/UploadResults/UploadResults'
import UploadTeacherResults from './components/UploadTeacherResults/UploadTeacherResults'
import AssignmentPostPage from './components/AssignmentPostPage/AssignmentPostPage'
import CommunicationPage from './components/CommunicationPage/CommunicationPage'
import StudentMessages from './components/StudentMessages/StudentMessages'
import ParentMessages from './components/ParentMessages/ParentMessages'
import TeacherPage from './components/TeacherPage/TeacherPage'
import AdminFeeReminderPage from './components/AdminFeeReminderPage/AdminFeeReminderPage'
import CreateResourcePage from './components/CreateResourcePage/CreateResourcePage'
import GradePage from './components/GradePage/GradePage'
import AssignmentSubmissionPage from './components/AssignmentSubmissionPage/AssignmentSubmissionPage'
import ResourceShowPage from './components/ResourceShowPage/ResourceShowPage'
import StudentGradesPage from './components/StudentGradesPage/StudentGradesPage'
import EbookPage from './components/EbookPage/EbookPage'
import ShowEbookPage from './components/ShowEbookPage/ShowEbookPage'
import SubmittedAssignment from './components/SubmittedAssignment/SubmittedAssignment'
import CreateMeeting from './components/CreateMeeting/CreateMeeting'
import ParentClassDataPage from './components/ParentClassDataPage/ParentClassDataPage'
import CreateSurveyForm from './components/CreateSurveyForm/CreateSurveyForm'
import GetSurveys from './components/GetSurveys/GetSurveys'
import SubjectEdit from './components/SubjectEdit/SubjectEdit'
import ClassCreate from './components/ClassCreate/ClassCreate';
import StudentList from './components/StudentList/StudentList';
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
        
          <Route path="/parentdashboard" element={<ParentDashboard />} />
          <Route path="/Alogin" element={<Alogin />} />
          <Route path="/Consent" element={<Consent />} />
          <Route path="/Reportc" element={<Reportc />} />
          <Route path='/Externalr' element={<ExternalR />} />
          <Route path='/Tlogin' element={<Tlogin />} />
          <Route path='/Circular' element={<Circular />} />
          <Route path='/Calendar' element={<Calendar />} />
          <Route path='/Leave' element={<Leave />} />
          <Route path='/Calen' element={<Calen />} />
          <Route path='/TimeTable/' element={<TimeTable />} />
          <Route path='/TimeOfRequest' element={<TimeOffRequest />} />
          <Route path='/Notification' element={<Notification />} />
          <Route path='/AttendancePage' element={<AttendancePage />} />
          <Route path='/Attendance' element={<Attendance />} />
          <Route path='/Infrastructure' element={<Infrastructure />} />
          <Route path="/event/:id" element={<Event />} />
          <Route path="/event" element={<Event />} />
          <Route path='/curriculum' element={<CurriculumPage />} />
          <Route path='/classcreate' element={<ClassCreate />} />
          <Route path='/studentlist' element={<StudentList />} />
        
          <Route path='/admindashboard' element={<AdminDashboard />} />
          <Route path='/StudentRegisterPage' element={<StudentRegisterPage />} />
          <Route path="/ParentRegisterpage" element={<ParentRegisterPage />} />
          <Route path="/Medical" element={<Medical />} />
          <Route path="/AdminRegister" element={<AdminRegister />} />
          <Route path="/Aboutus" element={<AboutUs />} />
          <Route path="/Award" element={<Award />} />
          <Route path="/ForgetPassword" element={<ForgetPassword />} />
          <Route path="/ResetPassword" element={<ResetPassword />} />
          <Route path="/TeacherRegister" element={<TeacherRegister />} />
          <Route path="/TransportRequest/" element={<TransportRequest />} />
          <Route path="/PaymentPage" element={<PaymentPage />} />
          <Route path="/ParentProfilePage" element={<ParentProfilePage />} />
          <Route path="/ParentProfilePage/" element={<ParentProfilePage />} />
          <Route path='/StudentProfilePage' element={<StudentProfilePage />} />
          <Route path="/StudentProfilePage/" element={<StudentProfilePage />} />
          <Route path="/StudentIdCardPage/" element={<StudentIdCardPage />} />
          <Route path="/CounselingRequest/" element={<CounselingRequest />} />
          <Route path="/ExitSlipRequest/" element={<ExitSlipRequest />} />
          <Route path="/ThirdPartyServices/" element={<ThirdPartyServices />} />
          <Route path="/BehaviorAssessmentTool/" element={<BehaviorAssessmentTool />} />
          <Route path="/FeeReminderPage" element={<FeeReminderPage />} />
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
          <Route path='/ConsentFormPage' element={<ConsentFormPage/>}/>          
          <Route path='/StudentView' element={<StudentView/>}/>          
          {/* <Route path='/SideNav/:studentId' element={<SideNav/>}/>           */}
          <Route path='/SideNav' element={<SideNav/>}/>          
          <Route path='/GoalsSettingInternalExam/' element={<GoalsSettingInternalExam/>}/>          
          <Route path='/GoalSettingView/' element={<GoalSettingView/>}/>          
          <Route path='/ExternalReport/' element={<ExternalReport/>}/>          
          <Route path='/ThirdPartyServicesStudent/' element={<ThirdPartyServicesStudent/>}/>          
          <Route path='/StudentWellbeingForm' element={<StudentWellbeingForm/>}/>          
          <Route path='/Chatbot/:studentId' element={<Chatbot/>}/>          
          <Route path='/AdminWellbeingRequests' element={<AdminWellbeingRequests/>}/>          
          <Route path='/AdminBehaviorAssessment' element={<AdminBehaviorAssessment/>}/>          
          <Route path='/BehaviorAssessmentPage/' element={<BehaviorAssessmentPage/>}/>          
          <Route path='/AdminChat/:admin_id' element={<AdminChat/>}/>            
          <Route path='/TeacherDashboard' element={<TeacherDashboard/>}/>            
          <Route path='/ClassManagementPage/' element={<ClassManagementPage/>}/>            
          <Route path='/AdminClassManagementPage' element={<AdminClassManagementPage/>}/>            
          <Route path="/TeacherStudentManagementPage" element={<TeacherStudentManagementPage/>} />           
          <Route path="/UploadResults" element={<UploadResults/>} />           
          <Route path="/UploadTeacherResults" element={<UploadTeacherResults/>} />           
          <Route path="/AssignmentPostPage" element={<AssignmentPostPage/>} />           
          <Route path="/CommunicationPage/" element={<CommunicationPage/>} />           
          <Route path="/StudentMessages/" element={<StudentMessages/>} />           
          <Route path="/ParentMessages/" element={<ParentMessages/>} />           
          <Route path="/TeacherPage" element={<TeacherPage/>} />           
          <Route path="/AdminFeeReminderPage" element={<AdminFeeReminderPage/>} />           
          <Route path="/CreateResourcePage/" element={<CreateResourcePage/>} />           
          <Route path="/GradePage" element={<GradePage/>} />           
          <Route path="/AssignmentSubmissionPage/" element={<AssignmentSubmissionPage/>} />           
          <Route path="/ResourceShowPage/" element={<ResourceShowPage/>} />           
          <Route path="/StudentGradesPage/" element={<StudentGradesPage/>} />  
          <Route path="/EbookPage" element={<EbookPage/>} />  
          <Route path="/ParentClassDataPage" element={<ParentClassDataPage/>} />  

          <Route path="/ShowEbookPage/" element={<ShowEbookPage/>} />            
          <Route path="/SubmittedAssignment/" element={<SubmittedAssignment/>} />            
          <Route path="/CreateMeeting/" element={<CreateMeeting/>} />            
          <Route path="/CreateSurveyForm/" element={<CreateSurveyForm/>} />            
          <Route path="/GetSurveys/" element={<GetSurveys/>} />            
          <Route path="/SubjectEdit/" element={<SubjectEdit/>} />            

        </Routes>
      </div>
    </Router>
  );
}

export default App; 
