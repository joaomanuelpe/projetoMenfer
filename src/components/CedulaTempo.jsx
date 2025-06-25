import React from 'react';

function CedulaTempo({ value, isEditing, onChange, onBlur }) {
  // Format time for display (HH:MM)
  const formatTimeForDisplay = (timeValue) => {
    if (!timeValue) return '';
    
    // If it's already in HH:MM format, return as is
    if (timeValue.includes(':') && timeValue.length <= 5) return timeValue;
    
    // Handle other time formats if needed
    return timeValue;
  };

  const handleChange = (inputValue) => {
    // Store time in HH:MM format
    onChange(inputValue);
  };

  if (isEditing) {
    return (
      <input
        type="time"
        value={value || ''}
        onChange={(e) => handleChange(e.target.value)}
        onBlur={onBlur}
        autoFocus
        className="absolute inset-0 w-full h-full p-2 border-2 border-blue-500 outline-none"
      />
    );
  }

  return (
    <div className="p-2 min-h-[2.5rem] hover:bg-orange-50 transition-colors flex items-center">
      <span className={`${value ? 'text-gray-900' : 'text-gray-400'}`}>
        {value ? formatTimeForDisplay(value) : 'HH:MM'}
      </span>
    </div>
  );
}

export default CedulaTempo;