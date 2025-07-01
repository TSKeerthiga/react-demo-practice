import React, { useCallback, useMemo, useState } from "react";

type CellProps = {
  value: string;
  onChange: (val: string) => void;
};

const Cell: React.FC<CellProps> = React.memo(({ value, onChange }) => {
  return (
    <td className="border border-gray-300 p-0 md:w-500 lg:w-350">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full h-10 text-center border-none outline-none"
      />
    </td>
  );
});

const ExcelReplication: React.FC = () => {
  const rowCount = 30;
  const colCount = 26;

  const getColumnLabel = (index: number): string => {
    let label = '';
    while (index >= 0) {
      label = String.fromCharCode((index % 26) + 65) + label;
      index = Math.floor(index / 26) - 1;
    }
    return label;
  };

  const columnLabels = useMemo(() => {
    return Array.from({ length: colCount }, (_, i) => getColumnLabel(i));
  }, [colCount]);

  const getCellKey = (row: number, col: number): string =>
    `${getColumnLabel(col)}${row + 1}`;

  const createEmptyGrid = (
    rows: number,
    cols: number
  ): { [cell: string]: string } => {
    const table: { [cell: string]: string } = {};
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        table[getCellKey(i, j)] = '';
      }
    }
    return table;
  };

  const [tableData, setTableData] = useState<{ [cell: string]: string }>(
    createEmptyGrid(rowCount, colCount)
  );

  const handleChangeCell = useCallback(
    (key: string, value: string) => {
      setTableData((prev) => {
        if (prev[key] === value) return prev;
        return { ...prev, [key]: value };
      });
    },
    []
  );

  return (
    <div className="max-w-6xl mx-auto p-6 mt-10 border rounded-lg shadow-md bg-white overflow-x-auto">
      <div className="overflow-x-auto">
      <table className="text-left border border-gray-800 border-collapse table-fixed rounded shadow-sm">
        <thead>
          <tr>
            <th className="w-10 h-10 bg-gray-100 border border-gray-300 md:w-500 lg:w-350"></th>
            {columnLabels.map((label, colIndex) => (
              <th className="border text-center" key={colIndex}>{label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: rowCount }, (_, rowIndex) => (
            <tr key={rowIndex} className="w:auto md:w-200 lg:w-200">
              <th className="border border-gray-300 bg-gray-100 w-10 text-center font-semibold md:w-500 lg:w-350">
                {rowIndex + 1}
              </th>
              {Array.from({ length: colCount }, (_, colIndex) => {
                const key = getCellKey(rowIndex, colIndex);
                return (
                  <Cell
                    key={key}
                    value={tableData[key] || ''}
                    onChange={(val) => handleChangeCell(key, val)}
                  />
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </div>
  );
};

export default ExcelReplication;
