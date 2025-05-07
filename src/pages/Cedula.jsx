import React from 'react';
import CedulaTexto from '../components/cells/CedulaTexto';
import CedulaSelecao from '../components/cells/CedulaSelecao';
import CelulaData from '../components/cells/CedulaData';
import ValorCedulaCondicional from '../components/cells/ValorCedulaCondicional';

function Cedula({ value, isEditing, onChange, onBlur, column }) {
  // Choose the right cell component based on the column type
  switch (column.type) {
    case 'select':
      return (
        <CedulaSelecao
          value={value}
          options={column.options}
          isEditing={isEditing}
          onChange={onChange}
          onBlur={onBlur}
        />
      );
    case 'date':
      return (
        <CelulaData
          value={value}
          isEditing={isEditing}
          onChange={onChange}
          onBlur={onBlur}
        />
      );
    case 'conditionalValue':
      return (
        <ValorCedulaCondicional
          value={value}
          options={column.options}
          valueLabel={column.valueLabel}
          isEditing={isEditing}
          onChange={onChange}
          onBlur={onBlur}
        />
      );
    case 'text':
    default:
      return (
        <CedulaTexto
          value={value}
          isEditing={isEditing}
          onChange={onChange}
          onBlur={onBlur}
        />
      );
  }
}

export default Cedula;