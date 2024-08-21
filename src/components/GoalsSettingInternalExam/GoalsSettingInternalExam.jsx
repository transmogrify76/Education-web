import React, { useState } from 'react';
import Sidebar from '../SideNav/SideNav';
import { FaTag } from 'react-icons/fa';
import './GoalsSettingInternalExam.css';

const GoalsSettingInternalExam = () => {
  const [formData, setFormData] = useState({
    arabic: {
      prevGrade: 0,
      suggestedTarget: 0,
      targetForThisGrade: 0
    },
    english: {
      prevGrade: 0,
      suggestedTarget: 0,
      targetForThisGrade: 0
    },
    hindi: {
      prevGrade: 0,
      suggestedTarget: 0,
      targetForThisGrade: 0
    },
    mathematics: {
      prevGrade: 0,
      suggestedTarget: 0,
      targetForThisGrade: 0
    },
    'science and technology': {
      prevGrade: 0,
      suggestedTarget: 0,
      targetForThisGrade: 0
    },
    'social studies': {
      prevGrade: 0,
      suggestedTarget: 0,
      targetForThisGrade: 0
    }
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const [subject, field] = name.split('.');
    setFormData((prevState) => ({
      ...prevState,
      [subject]: {
        ...prevState[subject],
        [field]: value
      }
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission, e.g., save the data to a backend or display a success message
  };

  return (
    <div className='side-with'>
      <Sidebar/>
      <form onSubmit={handleSubmit}>
        <h1>Goals Settings Internal Exam</h1>
        <div className="table">
          <div className="table-header">
            <div className="header-cell-one">
            <FaTag /> Sr no</div>
            <div className="header-cell-two"><FaTag /> Subject</div>
            <div className="header-cell-three"><FaTag /> My achievement for previous grade</div>
            <div className="header-cell-four"><FaTag /> Suggested target for current grade</div>
            <div className="header-cell-five"><FaTag /> My target for this grade</div>
          </div>
          <div className="table-body">
            <div className="table-row">
              <div className="table-cell">1</div>
              <div className="table-cell">ARABIC</div>
              <div className="table-cell">
                <input
                  type="number"
                  name="arabic.prevGrade"
                  value={formData.arabic.prevGrade}
                  onChange={handleInputChange}
                />
              </div>
              <div className="table-cell">
                <input
                  type="number"
                  name="arabic.suggestedTarget"
                  value={formData.arabic.suggestedTarget}
                  onChange={handleInputChange}
                />
              </div>
              <div className="table-cell">
                <input
                  type="number"
                  name="arabic.targetForThisGrade"
                  value={formData.arabic.targetForThisGrade}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className="table-row">
              <div className="table-cell">2</div>
              <div className="table-cell">ENGLISH</div>
              <div className="table-cell">
                <input
                  type="number"
                  name="english.prevGrade"
                  value={formData.arabic.prevGrade}
                  onChange={handleInputChange}
                />
              </div>
              <div className="table-cell">
                <input
                  type="number"
                  name="english.suggestedTarget"
                  value={formData.arabic.suggestedTarget}
                  onChange={handleInputChange}
                />
              </div>
              <div className="table-cell">
                <input
                  type="number"
                  name="english.targetForThisGrade"
                  value={formData.arabic.targetForThisGrade}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className="table-row">
              <div className="table-cell">3</div>
              <div className="table-cell">HINDI</div>
              <div className="table-cell">
                <input
                  type="number"
                  name="hindi.prevGrade"
                  value={formData.arabic.prevGrade}
                  onChange={handleInputChange}
                />
              </div>
              <div className="table-cell">
                <input
                  type="number"
                  name="hindi.suggestedTarget"
                  value={formData.arabic.suggestedTarget}
                  onChange={handleInputChange}
                />
              </div>
              <div className="table-cell">
                <input
                  type="number"
                  name="hindi.targetForThisGrade"
                  value={formData.arabic.targetForThisGrade}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className="table-row">
              <div className="table-cell">4</div>
              <div className="table-cell">MATHEMATICS</div>
              <div className="table-cell">
                <input
                  type="number"
                  name="mathematics.prevGrade"
                  value={formData.arabic.prevGrade}
                  onChange={handleInputChange}
                />
              </div>
              <div className="table-cell">
                <input
                  type="number"
                  name="mathematics.suggestedTarget"
                  value={formData.arabic.suggestedTarget}
                  onChange={handleInputChange}
                />
              </div>
              <div className="table-cell">
                <input
                  type="number"
                  name="mathematics.targetForThisGrade"
                  value={formData.arabic.targetForThisGrade}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className="table-row">
              <div className="table-cell">5</div>
              <div className="table-cell">SCIENCE AND TECHNOLOGY</div>
              <div className="table-cell">
                <input
                  type="number"
                  name="scienceandtehnology.prevGrade"
                  value={formData.arabic.prevGrade}
                  onChange={handleInputChange}
                />
              </div>
              <div className="table-cell">
                <input
                  type="number"
                  name="scienceandtehnology.suggestedTarget"
                  value={formData.arabic.suggestedTarget}
                  onChange={handleInputChange}
                />
              </div>
              <div className="table-cell">
                <input
                  type="number"
                  name="scienceandtehnology.targetForThisGrade"
                  value={formData.arabic.targetForThisGrade}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className="table-row">
              <div className="table-cell">6</div>
              <div className="table-cell">SOCIAL STUDIES</div>
              <div className="table-cell">
                <input
                  type="number"
                  name="social.prevGrade"
                  value={formData.arabic.prevGrade}
                  onChange={handleInputChange}
                />
              </div>
              <div className="table-cell">
                <input
                  type="number"
                  name="social.suggestedTarget"
                  value={formData.arabic.suggestedTarget}
                  onChange={handleInputChange}
                />
              </div>
              <div className="table-cell">
                <input
                  type="number"
                  name="social.targetForThisGrade"
                  value={formData.arabic.targetForThisGrade}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            {/* Repeat for other rows */}
          </div>
        </div>
        <button className= "button-g "type="submit">Submit</button>
      </form>
    </div>
  );
};

export default GoalsSettingInternalExam;
