import React from 'react';

function CedulaData({ value, isEditing, onChange, onBlur }) {
  // Convert date from YYYY-MM-DD to DD/MM/YYYY for display
  const formatDateForDisplay = (dateValue) => {
    if (!dateValue) return '';
    
    // If it's already in DD/MM/YYYY format, return as is
    if (dateValue.includes('/')) return dateValue;
    
    // Convert from YYYY-MM-DD to DD/MM/YYYY
    const [year, month, day] = dateValue.split('-');
    return `${day}/${month}/${year}`;
  };

  // Convert date from DD/MM/YYYY to YYYY-MM-DD for input
  const formatDateForInput = (dateValue) => {
    if (!dateValue) return '';
    
    // If it's already in YYYY-MM-DD format, return as is
    if (dateValue.includes('-') && dateValue.length === 10) return dateValue;
    
    // Convert from DD/MM/YYYY to YYYY-MM-DD
    if (dateValue.includes('/')) {
      const [day, month, year] = dateValue.split('/');
      return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    }
    
    return dateValue;
  };

  const handleChange = (inputValue) => {
    // Convert the input value (YYYY-MM-DD) to display format (DD/MM/YYYY)
    if (inputValue) {
      const [year, month, day] = inputValue.split('-');
      const displayValue = `${day}/${month}/${year}`;
      onChange(displayValue);
    } else {
      onChange('');
    }
  };

  if (isEditing) {
    return (
      <input
        type="date"
        value={formatDateForInput(value)}
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
        {value ? formatDateForDisplay(value) : 'DD/MM/AAAA'}
      </span>
    </div>
  );
}

export default CedulaData;