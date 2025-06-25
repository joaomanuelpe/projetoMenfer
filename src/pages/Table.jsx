import React, { useState } from 'react';
import Cedula from './Cedula';

function Table({ columns, data, onDataChange }) {
  const [editCell, setEditCell] = useState(null);

  const handleCellClick = (rowIndex, columnId) => {
    setEditCell({ rowIndex, columnId });
  };

  const handleCellChange = (rowIndex, columnId, value) => {
    const newData = [...data];
    newData[rowIndex] = { ...newData[rowIndex], [columnId]: value };
    onDataChange(newData);
  };

  const handleBlur = () => {
    setEditCell(null);
  };

  return (
    <table className="w-full border-collapse table-auto">
      <thead>
        <tr>
          <th className="bg-orange-50 text-orange-700 font-semibold text-sm py-3 px-4 border-b border-orange-200 sticky top-0 whitespace-nowrap">
            #
          </th>
          {columns.map((column) => (
            <th 
              key={column.id}
              className="bg-orange-50 text-orange-700 font-semibold text-sm py-3 px-4 border-b border-orange-200 sticky top-0 whitespace-nowrap"
              style={{ minWidth: column.minWidth || '120px' }}
            >
              {column.label}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row, rowIndex) => (
          <tr key={rowIndex} className={rowIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
            <td className="border border-orange-200 text-center text-sm text-gray-600 font-medium px-4">
              {rowIndex + 1}
            </td>
            {columns.map((column) => {
              const isEditing = editCell?.rowIndex === rowIndex && editCell?.columnId === column.id;
              let cellClass = "border border-orange-200 relative";
              if (column.id === 'status' && row[column.id]) {
                if (row[column.id] === 'QUITADO') {
                  cellClass += " bg-green-100";
                } else if (row[column.id] === 'VENCIDO') {
                  cellClass += " bg-red-100";
                }
              }
              
              return (
                <td
                  key={`${rowIndex}-${column.id}`}
                  className={cellClass}
                  onClick={() => handleCellClick(rowIndex, column.id)}
                >
                  <Cedula
                    value={row[column.id] || ''}
                    isEditing={isEditing}
                    onChange={(value) => handleCellChange(rowIndex, column.id, value)}
                    onBlur={handleBlur}
                    column={column}
                  />
                </td>
              );
            })}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default Table;