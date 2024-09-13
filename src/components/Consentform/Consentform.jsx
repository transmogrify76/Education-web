import React from 'react';
import Select from 'react-select';
import Header from '../Header/Header';

const ConsentForm = () => {
  // Sample options for the dropdown
  const options = [
    { value: 'option1', label: 'Option 1' },
    { value: 'option2', label: 'Option 2' },
    { value: 'option3', label: 'Option 3' },
    // Add more options as needed
  ];

  return (
    <div>
      <Hedaer/>
    <div>
      <h2>Dear Parent,</h2>
      <p>For the information in the dropdown below, we require your consent.</p>
      <Select options={options} placeholder="Please select" />
    </div>  
    </div>
  );
}

export default ConsentForm;
