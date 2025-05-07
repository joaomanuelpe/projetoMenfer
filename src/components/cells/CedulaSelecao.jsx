import React from 'react';

function CedulaSelecao({ value, options, isEditing, onChange, onBlur }) {
  if (isEditing) {
    return (
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        autoFocus
        className="absolute inset-0 w-full h-full p-2 border-2 border-blue-500 outline-none"
      >
        <option value="">Selecione...</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    );
  }

  return (
    <div className="p-2 min-h-[2.5rem] hover:bg-orange-50 transition-colors">
      {value}
    </div>
  );
}

export default CedulaSelecao;