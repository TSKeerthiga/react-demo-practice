// ExcelReplication.tsx
import React from 'react';
import SpreadsheetTable from './components/SpreadsheetTable';
import { useSpreadsheetLogic } from './useSpreadsheetLogic';

const ExcelReplication: React.FC = () => {
  const {
    rowCount,
    colCount,
    tableData,
    columnLabels,
    getCellKey,
    handleKeyPress,
    handleChangeCell,
    handleOnClick,
    selectedCells
  } = useSpreadsheetLogic();

  return (
    <div className="max-w-6xl mx-auto p-6 mt-10 border rounded-lg shadow-md bg-white overflow-x-auto">
      <SpreadsheetTable
        rowCount={rowCount}
        colCount={colCount}
        tableData={tableData}
        columnLabels={columnLabels}
        getCellKey={getCellKey}
        handleKeyPress={handleKeyPress}
        handleChangeCell={handleChangeCell}
        handleOnClick={handleOnClick}
        selectedCells={selectedCells}
      />
    </div>
  );
};

export default ExcelReplication;
