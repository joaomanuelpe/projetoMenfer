import React from 'react';

function CedulaData({ value, isEditing, onChange, onBlur }) {
  if (isEditing) {
    return (
      <input
        type="date"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        autoFocus
        className="absolute inset-0 w-full h-full p-2 border-2 border-blue-500 outline-none"
      />
    );
  }

  return (
    <div className="p-2 min-h-[2.5rem] hover:bg-orange-50 transition-colors">
      {value}
    </div>
  );
}

export default CedulaData;