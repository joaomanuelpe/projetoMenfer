import React, { useState, useEffect } from 'react';

function ValorCedulaCondicional({ value, options, valueLabel, isEditing, onChange, onBlur }) {
  // Parse the stored value which could be in format "SIM:1500" or just "NÃO"
  const [option, setValue] = useState('');
  const [additionalValue, setAdditionalValue] = useState('');

  useEffect(() => {
    if (value) {
      if (value.includes(':')) {
        const [opt, val] = value.split(':');
        setValue(opt);
        setAdditionalValue(val);
      } else {
        setValue(value);
        setAdditionalValue('');
      }
    }
  }, [value]);

  const handleChange = (newOption, newValue = '') => {
    if (newOption === 'SIM' && newValue) {
      onChange(`${newOption}:${newValue}`);
    } else {
      onChange(newOption);
    }
  };

  if (isEditing) {
    return (
      <div className="absolute inset-0 flex border-2 border-blue-500">
        <select
          value={option}
          onChange={(e) => {
            setValue(e.target.value);
            if (e.target.value !== 'SIM') {
              handleChange(e.target.value);
            }
          }}
          className="w-1/2 p-2 outline-none"
        >
          <option value="">Selecione...</option>
          {options.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
        
        {option === 'SIM' && (
          <div className="w-1/2 p-2 flex items-center bg-gray-50">
            <span className="text-xs text-gray-500 mr-1">{valueLabel}:</span>
            <input
              type="text"
              value={additionalValue}
              onChange={(e) => {
                setAdditionalValue(e.target.value);
                handleChange('SIM', e.target.value);
              }}
              className="flex-1 border border-gray-300 p-1 outline-none"
              onBlur={onBlur}
            />
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="p-2 min-h-[2.5rem] hover:bg-orange-50 transition-colors">
      {value.includes(':') 
        ? `${option} (${valueLabel}: ${additionalValue})` 
        : value}
    </div>
  );
}

export default ValorCedulaCondicional;