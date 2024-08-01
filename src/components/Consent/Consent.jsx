import React from 'react';
import Select from 'react-select';
import './Consent.css';

const Consent = () => {
  // Sample options for the dropdown
  const options = [
    { value: 'option1', label: 'Option 1' },
    { value: 'option2', label: 'Option 2' },
    { value: 'option3', label: 'Option 3' },
    // Add more options as needed
  ];

  return (
    <div className='consent-letter'>
        <h2 className='head'>Consent Form </h2>
      <p className='para'>Dear Parent, for the information in the dropdown below, we require your consent.</p>
      <div className='drop'>
        <Select options={options} placeholder="Please select" isSearchable={false} />
      </div>
    </div>
  );
}

export default Consent;
