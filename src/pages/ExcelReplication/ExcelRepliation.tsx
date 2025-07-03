import React, { useCallback, useEffect, useMemo, useState } from "react";
const sampleData = [
  {
    Id: 1,
    Name: 'Keerthiga',
    Email: 'Keerthiga@gmail.com',
    PhoneNumber: 9087654321
  },
  {
    Id: 2,
    Name: 'Abi',
    Email: 'abi@gmail.com',
    PhoneNumber: 8712965430
  }, {
    Id: 3,
    Name: 'Suresh',
    Email: 'suresh@gmail.com',
    PhoneNumber: 76543213432
  }, {
    Id: 4,
    Name: 'Dinesh',
    Email: 'dinesh@yahoo.com',
    PhoneNumber: 9087654321
  }, {
    Id: 5,
    Name: 'Karthick',
    Email: 'karthick@gmail.com',
    PhoneNumber: 9087654321
  }
];

type CellProps = {
  value: string;
  onChange: (val: string) => void;
  bold?: boolean;
};

const Cell: React.FC<CellProps> = React.memo(({ value, onChange, bold }) => {
  return (
    <td className="border border-gray-300 p-0">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full h-10 text-center border-none focus:outline ${bold ? 'font-bold bg-gray-80': ''}`}
      />
    </td>
  );
});

const ExcelReplication: React.FC = () => {
  const rowCount = 30;
  const colCount = 30;

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
    console.log(table)
    return table;
  };

  const [tableData, setTableData] = useState<{ [cell: string]: string }>(
    createEmptyGrid(rowCount, colCount)

  );

  useEffect(() => {
    const loadedData = createEmptyGrid(rowCount, colCount);

    // loadHeaders
    const headers = Object.keys(sampleData[0]);

    headers.forEach((header, headIndex) => {
      loadedData[getCellKey(0, headIndex)] = header;
    });

    sampleData.forEach((row, rowIndex) => {
      console.log(row, rowIndex)
      Object.values(row).forEach((value, colIndex) => {
        loadedData[getCellKey(rowIndex + 1, colIndex)] = String(value);
      })
    })

    setTableData(loadedData);
  }, []);

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
        <table className="table-auto w-full min-w-max border-collapse text-sm sm:text-base md:text-lg">
          <thead>
            <tr>
              <th className="w-10 h-10 bg-gray-100 border border-gray-300"></th>
              {columnLabels.map((label, colIndex) => (
                <th
                className={`min-w-[200px] sm:min-w-[240px] md:min-w-[120px] lg:min-w-[80px] border text-center whitespace-nowrap`} key={colIndex}>{label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: rowCount }, (_, rowIndex) => (
              <tr key={rowIndex} >
                <th className="border border-gray-300 bg-gray-100 w-10 text-center font-semibold">
                  {rowIndex + 1}
                </th>
                {Array.from({ length: colCount }, (_, colIndex) => {
                  const key = getCellKey(rowIndex, colIndex);
                  let isHeaderRow = rowIndex === 0;
                  return (
                    <Cell
                      key={key}
                      value={tableData[key] || ''}
                      onChange={(val) => handleChangeCell(key, val)}
                      bold={isHeaderRow}
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
