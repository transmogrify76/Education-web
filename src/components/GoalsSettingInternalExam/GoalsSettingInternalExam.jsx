// import React, { useState, useEffect } from 'react';
// import { useParams } from 'react-router-dom';
// import Sidebar from '../SideNav/SideNav';
// import { FaTag } from 'react-icons/fa';
// import './GoalsSettingInternalExam.css';
// import Header from '../Header/Header';

// const GoalsSettingInternalExam = () => {
//   const { studentId } = useParams();
//   const [subjects, setSubjects] = useState([
//     { name: 'arabic', prevGrade: '', suggestedTarget: '', targetForThisGrade: '' },
//     { name: 'english', prevGrade: '', suggestedTarget: '', targetForThisGrade: '' },
//     { name: 'urdu', prevGrade: '', suggestedTarget: '', targetForThisGrade: '' },
//     { name: 'mathematics', prevGrade: '', suggestedTarget: '', targetForThisGrade: '' },
//     { name: 'science and technology', prevGrade: '', suggestedTarget: '', targetForThisGrade: '' },
//     { name: 'social studies', prevGrade: '', suggestedTarget: '', targetForThisGrade: '' }
//   ]);
//   const [student, setStudent] = useState(null);
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     const fetchStudentData = async () => {
//       try {
//         const response = await fetch(`http://localhost:3000/goal-setting/student`);
//         if (!response.ok) {
//           throw new Error('Failed to fetch student data');
//         }
//         const data = await response.json();
//         setStudent(data);
//         if (data && data.subjects) {
//           setSubjects(data.subjects.map(subject => ({
//             name: subject.name,
//             prevGrade: subject.prevGrade || '',
//             suggestedTarget: subject.suggestedTarget || '',
//             targetForThisGrade: subject.targetForThisGrade || ''
//           })));
//         }
//       } catch (error) {
//         console.error('Error fetching student data:', error);
//       }
//     };

//     fetchStudentData();
//   }, [studentId]);

//   const handleInputChange = (index, field, value) => {
//     const updatedSubjects = [...subjects];
//     updatedSubjects[index] = { ...updatedSubjects[index], [field]: value };
//     setSubjects(updatedSubjects);
//   };

//   const calculateOverallAchievements = () => {
//     const achievements = subjects.map(subject => parseFloat(subject.prevGrade) || 0);
//     const totalAchievements = achievements.reduce((acc, val) => acc + val, 0);
//     const averageAchievement = achievements.length ? totalAchievements / achievements.length : 0;

//     return {
//       myAchievementsForPreviousGrade: `Achieved ${averageAchievement.toFixed(2)}% overall`,
//       suggestedTargetForCurrentGrade: `${Math.max(...achievements.map(a => parseFloat(a) || 0)).toFixed(2)}%`,
//       myTargetForThisGrade: `${Math.max(...subjects.map(subject => parseFloat(subject.targetForThisGrade) || 0)).toFixed(2)}%`
//     };
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (loading) return; // Prevent multiple submissions

//     setLoading(true);
//     const overallData = calculateOverallAchievements();

//     const dataToSubmit = {
//       studentId,
//       arabicAchievement: subjects.find(s => s.name === 'arabic').prevGrade,
//       arabicSuggestedTarget: subjects.find(s => s.name === 'arabic').suggestedTarget,
//       arabicMyTarget: subjects.find(s => s.name === 'arabic').targetForThisGrade,
//       englishAchievement: subjects.find(s => s.name === 'english').prevGrade,
//       englishSuggestedTarget: subjects.find(s => s.name === 'english').suggestedTarget,
//       englishMyTarget: subjects.find(s => s.name === 'english').targetForThisGrade,
//       hindiAchievement: subjects.find(s => s.name === 'urdu').prevGrade,
//       hindiSuggestedTarget: subjects.find(s => s.name === 'urdu').suggestedTarget,
//       hindiMyTarget: subjects.find(s => s.name === 'urdu').targetForThisGrade,
//       mathematicsAchievement: subjects.find(s => s.name === 'mathematics').prevGrade,
//       mathematicsSuggestedTarget: subjects.find(s => s.name === 'mathematics').suggestedTarget,
//       mathematicsMyTarget: subjects.find(s => s.name === 'mathematics').targetForThisGrade,
//       scienceAndTechnologyAchievement: subjects.find(s => s.name === 'science and technology').prevGrade,
//       scienceAndTechnologySuggestedTarget: subjects.find(s => s.name === 'science and technology').suggestedTarget,
//       scienceAndTechnologyMyTarget: subjects.find(s => s.name === 'science and technology').targetForThisGrade,
//       socialStudiesAchievement: subjects.find(s => s.name === 'social studies').prevGrade,
//       socialStudiesSuggestedTarget: subjects.find(s => s.name === 'social studies').suggestedTarget,
//       socialStudiesMyTarget: subjects.find(s => s.name === 'social studies').targetForThisGrade,
//       myAchievementsForPreviousGrade: overallData.myAchievementsForPreviousGrade,
//       suggestedTargetForCurrentGrade: overallData.suggestedTargetForCurrentGrade,
//       myTargetForThisGrade: overallData.myTargetForThisGrade,
//     };

//     try {
//       const method = student ? 'PATCH' : 'POST';
//       const url = student
//         ? `http://localhost:3000/goal-setting/student`
//         : 'http://localhost:3000/goal-setting';


//       const response = await fetch(url, {
//         method: method,
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(dataToSubmit),
//       });

//       if (!response.ok) {
//         throw new Error(`Failed to ${method === 'POST' ? 'submit' : 'update'} data`);
//       }

//       const data = await response.json();
//       console.log('Success:', data);
//     } catch (error) {
//       console.error('Error:', error);
//     } finally {
//       setLoading(false); // Re-enable form submission
//     }
//   };


//   return (
//     <div className='for-header'>
//       <Header />
//       <div className='side-with'>
//         <Sidebar studentId={studentId} />
//         <form onSubmit={handleSubmit}>
//           <h1>Goals Settings Internal Exam</h1>
//           <div className="table">
//             <div className="table-header">
//               <div className="header-cell-one">
//                 <FaTag /> Sr no
//               </div>
//               <div className="header-cell-two">
//                 <FaTag /> Subject
//               </div>
//               <div className="header-cell-three">
//                 <FaTag /> My achievement for previous grade
//               </div>
//               <div className="header-cell-four">
//                 <FaTag /> Suggested target for current grade
//               </div>
//               <div className="header-cell-five">
//                 <FaTag /> My target for this grade
//               </div>
//             </div>
//             <div className="table-body">
//               {subjects.map((subject, index) => (
//                 <div className="table-row" key={subject.name}>
//                   <div className="table-cell">{index + 1}</div>
//                   <div className="table-cell">{subject.name.toUpperCase()}</div>
//                   <div className="table-cell">
//                     <input
//                       type="number"
//                       value={subject.prevGrade}
//                       onChange={(e) => handleInputChange(index, 'prevGrade', e.target.value)}
//                     />
//                   </div>
//                   <div className="table-cell">
//                     <input
//                       type="number"
//                       value={subject.suggestedTarget}
//                       onChange={(e) => handleInputChange(index, 'suggestedTarget', e.target.value)}
//                     />
//                   </div>
//                   <div className="table-cell">
//                     <input
//                       type="number"
//                       value={subject.targetForThisGrade}
//                       onChange={(e) => handleInputChange(index, 'targetForThisGrade', e.target.value)}
//                     />
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//           <button className="button-g" type="submit" disabled={loading}>
//             {loading ? 'Submitting...' : 'Submit'}
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default GoalsSettingInternalExam;

import React, { useState, useEffect } from 'react';
import Sidebar from '../SideNav/SideNav';
import { FaTag } from 'react-icons/fa';
import './GoalsSettingInternalExam.css';
import Header from '../Header/Header';
import { jwtDecode } from 'jwt-decode';  // Corrected import

const GoalsSettingInternalExam = () => {
  const [subjects, setSubjects] = useState([
    { name: 'arabic', prevGrade: '', suggestedTarget: '', targetForThisGrade: '' },
    { name: 'english', prevGrade: '', suggestedTarget: '', targetForThisGrade: '' },
    { name: 'urdu', prevGrade: '', suggestedTarget: '', targetForThisGrade: '' },
    { name: 'mathematics', prevGrade: '', suggestedTarget: '', targetForThisGrade: '' },
    { name: 'science and technology', prevGrade: '', suggestedTarget: '', targetForThisGrade: '' },
    { name: 'social studies', prevGrade: '', suggestedTarget: '', targetForThisGrade: '' }
  ]);
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState(null); // Add state for userId

  useEffect(() => {
    // Fetch the userId from JWT token if available
    const token = localStorage.getItem('authToken');
    if (token) {
      const decodedToken = jwtDecode(token);
      setUserId(decodedToken.userId); // Extract userId from decoded token
    }

    const fetchStudentData = async () => {
      try {
        const response = await fetch(`http://localhost:3000/goal-setting/student`);
        if (!response.ok) {
          throw new Error('Failed to fetch student data');
        }
        const data = await response.json();
        setStudent(data);
        if (data && data.subjects) {
          setSubjects(data.subjects.map(subject => ({
            name: subject.name,
            prevGrade: subject.prevGrade || '',
            suggestedTarget: subject.suggestedTarget || '',
            targetForThisGrade: subject.targetForThisGrade || ''
          })));
        }
      } catch (error) {
        console.error('Error fetching student data:', error);
      }
    };

    fetchStudentData();
  }, []);

  const handleInputChange = (index, field, value) => {
    const updatedSubjects = [...subjects];
    updatedSubjects[index] = { ...updatedSubjects[index], [field]: value };
    setSubjects(updatedSubjects);
  };

  const calculateOverallAchievements = () => {
    const achievements = subjects.map(subject => parseFloat(subject.prevGrade) || 0);
    const totalAchievements = achievements.reduce((acc, val) => acc + val, 0);
    const averageAchievement = achievements.length ? totalAchievements / achievements.length : 0;

    return {
      myAchievementsForPreviousGrade: `Achieved ${averageAchievement.toFixed(2)}% overall`,
      suggestedTargetForCurrentGrade: `${Math.max(...achievements.map(a => parseFloat(a) || 0)).toFixed(2)}%`,
      myTargetForThisGrade: `${Math.max(...subjects.map(subject => parseFloat(subject.targetForThisGrade) || 0)).toFixed(2)}%`
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return; // Prevent multiple submissions

    setLoading(true);
    const overallData = calculateOverallAchievements();

    const dataToSubmit = {
      userId, // Include the userId here
      arabicAchievement: subjects.find(s => s.name === 'arabic').prevGrade,
      arabicSuggestedTarget: subjects.find(s => s.name === 'arabic').suggestedTarget,
      arabicMyTarget: subjects.find(s => s.name === 'arabic').targetForThisGrade,
      englishAchievement: subjects.find(s => s.name === 'english').prevGrade,
      englishSuggestedTarget: subjects.find(s => s.name === 'english').suggestedTarget,
      englishMyTarget: subjects.find(s => s.name === 'english').targetForThisGrade,
      hindiAchievement: subjects.find(s => s.name === 'urdu').prevGrade,
      hindiSuggestedTarget: subjects.find(s => s.name === 'urdu').suggestedTarget,
      hindiMyTarget: subjects.find(s => s.name === 'urdu').targetForThisGrade,
      mathematicsAchievement: subjects.find(s => s.name === 'mathematics').prevGrade,
      mathematicsSuggestedTarget: subjects.find(s => s.name === 'mathematics').suggestedTarget,
      mathematicsMyTarget: subjects.find(s => s.name === 'mathematics').targetForThisGrade,
      scienceAndTechnologyAchievement: subjects.find(s => s.name === 'science and technology').prevGrade,
      scienceAndTechnologySuggestedTarget: subjects.find(s => s.name === 'science and technology').suggestedTarget,
      scienceAndTechnologyMyTarget: subjects.find(s => s.name === 'science and technology').targetForThisGrade,
      socialStudiesAchievement: subjects.find(s => s.name === 'social studies').prevGrade,
      socialStudiesSuggestedTarget: subjects.find(s => s.name === 'social studies').suggestedTarget,
      socialStudiesMyTarget: subjects.find(s => s.name === 'social studies').targetForThisGrade,
      myAchievementsForPreviousGrade: overallData.myAchievementsForPreviousGrade,
      suggestedTargetForCurrentGrade: overallData.suggestedTargetForCurrentGrade,
      myTargetForThisGrade: overallData.myTargetForThisGrade,
    };

    try {
      const method = student ? 'PATCH' : 'POST';
      const url = student
        ? `http://localhost:3000/goal-setting/student`
        : 'http://localhost:3000/goal-setting';

      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSubmit),
      });

      if (!response.ok) {
        throw new Error(`Failed to ${method === 'POST' ? 'submit' : 'update'} data`);
      }

      const data = await response.json();
      console.log('Success:', data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false); // Re-enable form submission
    }
  };

  return (
    <div className='for-header'>
      <Header />
      <div className='side-with'>
        <Sidebar /> {/* Remove studentId here as it's no longer needed */}
        <form onSubmit={handleSubmit}>
          <h1>Goals Settings Internal Exam</h1>
          <div className="table">
            <div className="table-header">
              <div className="header-cell-one">
                <FaTag /> Sr no
              </div>
              <div className="header-cell-two">
                <FaTag /> Subject
              </div>
              <div className="header-cell-three">
                <FaTag /> My achievement for previous grade
              </div>
              <div className="header-cell-four">
                <FaTag /> Suggested target for current grade
              </div>
              <div className="header-cell-five">
                <FaTag /> My target for this grade
              </div>
            </div>
            <div className="table-body">
              {subjects.map((subject, index) => (
                <div className="table-row" key={subject.name}>
                  <div className="table-cell">{index + 1}</div>
                  <div className="table-cell">{subject.name.toUpperCase()}</div>
                  <div className="table-cell">
                    <input
                      type="number"
                      value={subject.prevGrade}
                      onChange={(e) => handleInputChange(index, 'prevGrade', e.target.value)}
                    />
                  </div>
                  <div className="table-cell">
                    <input
                      type="number"
                      value={subject.suggestedTarget}
                      onChange={(e) => handleInputChange(index, 'suggestedTarget', e.target.value)}
                    />
                  </div>
                  <div className="table-cell">
                    <input
                      type="number"
                      value={subject.targetForThisGrade}
                      onChange={(e) => handleInputChange(index, 'targetForThisGrade', e.target.value)}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <button className="button-g" type="submit" disabled={loading}>
            {loading ? 'Submitting...' : 'Submit'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default GoalsSettingInternalExam;
