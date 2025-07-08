import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { boolean } from "zod";
import { es } from "zod/dist/types/v4/locales";
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
  cellKey: string;
  value: string;
  onChange: (val: string) => void;
  bold?: boolean;
  onKeyUp?: any;
  onClick?: any;
  className?: string;
};

function useCurrentAndPrevious<T>(initialValue: T): [T, (val: T) => void, T | undefined] {
  const [current, setCurrent] = useState<T>(initialValue);
  const previousRef = useRef<T | undefined>(undefined);

  useEffect(() => {
    previousRef.current = current;
  }, [current]);

  return [current, setCurrent, previousRef.current];
}

const Cell: React.FC<CellProps> = React.memo(({ cellKey, value, onChange, onClick, bold, onKeyUp, className }) => {
  return (
    <td className="border border-gray-300 p-0">
      <input
        name={cellKey}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onClick={(e) => onClick(cellKey)}
        className={`w-full h-10 text-center border-none focus:outline ${bold ? 'font-bold bg-gray-80' : ''} ${className}`}
        onKeyUp={(e) => onKeyUp(e)}
      />
    </td>
  );
});

const ExcelReplication: React.FC = () => {
  const rowCount = 30;
  const colCount = 30;
  const [inputName, setInputName, prevInputName] = useCurrentAndPrevious<string>('');
  const [editModeCell, setEditModeCell] = useState<string | null>(null);
  const [validateTabShiftInputName, setValidateTabShiftInputName] = useState<string | undefined>('');
  const [selectedCells, setSelectedCells] = useState<string[]>([]);
  const [isExtendedSelect, setIsExtendedSelect] = useState(false);

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
    // console.log(table)
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
      // console.log(row, rowIndex)
      Object.values(row).forEach((value, colIndex) => {
        loadedData[getCellKey(rowIndex + 1, colIndex)] = String(value);
      })
    })

    setTableData(loadedData);
  }, []);

  const handleChangeCell = useCallback(
    (key: string, value: string) => {
      // console.log(key, value)
      setTableData((prev) => {
        if (prev[key] === value) return prev;
        return { ...prev, [key]: value };
      });
    },
    []
  );

  const nextColName = (currentName: string, type: string) => {
    const match = currentName.match(/^([A-Z]+)(\d+)$/);
    if (!match) return;

    let col = match[1];
    let row = parseInt(match[2]);

    switch (type) {
      case 'ArrowDown':
        row += 1;
        break;

      case 'ArrowUp':
        row = Math.max(1, row - 1); // prevent going above 1
        break;

      case 'ArrowLeft': {
        let colIndex = col.charCodeAt(0) - 65;
        if (colIndex > 0) col = String.fromCharCode(colIndex + 64);
        break;
      }

      case 'ArrowRight': {
        let colIndex = col.charCodeAt(0) - 65;
        if (colIndex < 25) col = String.fromCharCode(colIndex + 66);
        break;
      }

      case 'SCArrowDown':
        handleCtrlShiftArrow(match, "Down");
        return;

      case 'SCArrowUp':
        handleCtrlShiftArrow(match, "Up");
        return;

      case 'selectAll':
        handleSelectAll();
        return;

      default:
        break;
    }

    return `${col}${row}`;
  };


  const handleCtrlShiftArrow = (match: any, direction: string) => {
    const col = match[1]; // e.g., "B"
    const row = parseInt(match[2]); // e.g., 2
    const currentKey = `${col}${row}`;
    const currentVal = tableData[currentKey];
    let selected: string[] = [];

    if (direction === "Down") {
      if (isExtendedSelect) {
        console.log("2nd press → select everything down", row, col);
        // 2nd press → select everything down
        for (let i = row - 1; i <= rowCount; i++) {
          selected.push(`${col}${i}`);
        }
      } else {
        if (currentVal && currentVal.trim() !== '') {
          // 1st press, current cell has value → select all non-empty below
          for (let i = row; i <= rowCount; i++) {
            const key = `${col}${i}`;
            const val = tableData[key];
            if (val && val.trim() !== '') {
              selected.push(key);
            } else {
              break;
            }
          }
        } else {
          // 1st press, current cell is empty → select contiguous empty cells
          console.log("1st press, current cell is empty → select contiguous empty cells", row, col);
          for (let i = row; i <= rowCount; i++) {
            const key = `${col}${i}`;
            const val = tableData[key];
            if (!val || val.trim() === '') {
              selected.push(key);
            } else {
              break;
            }
          }
        }
      }

      setIsExtendedSelect(true);
    }
    else if (direction === "Up") {
      if (isExtendedSelect) {
        console.log("2nd press → select everything up", row, col);
        // 2nd press → select everything up
        for (let i = row + 1; i >= 1; i--) {
          selected.push(`${col}${i}`);
        }
      } else {
        if (currentVal && currentVal.trim() !== '') {
          // 1st press, current cell has value → select all non-empty above
          for (let i = row ; i >= 1; i--) {
            const key = `${col}${i}`;
            const val = tableData[key];
            if (val && val.trim() !== '') {
              selected.push(key);
            } else {
              break;
            }
          }
        } else {
          // 1st press, current cell is empty → select contiguous empty cells above
          console.log("1st press, current cell is empty → select contiguous empty cells", row, col);
          for (let i = row ; i >= 1; i--) {
            const key = `${col}${i}`;
            const val = tableData[key];
            if (!val || val.trim() === '') {
              selected.push(key);
            } else {
              break;
            }
          }
        }
      }

      setIsExtendedSelect(true);
    }


    if (selected.length > 0) {
      const lastCell = selected[selected.length - 1];
      console.log("lastCell", lastCell)
      setSelectedCells(selected);
      focusInput(lastCell);
      setInputName(lastCell);
    }
  };


  const handleSelectAll = () => {
    const selected: string[] = [];

    for (let i = 0; i < rowCount; i++) {
      for (let j = 0; j < colCount; j++) {
        const key = getCellKey(i, j);
        const value = tableData[key];
        if (value && value.trim() !== '') {
          selected.push(key);
        }
      }
    }
    console.log("Selected Cells:", selected);
    if (selected.length > 0) {
      const lastCell = selected[selected.length - 1];
      console.log("lastCell", lastCell)
      setSelectedCells(selected);
      focusInput(lastCell);
      setInputName(lastCell);
    }
  };


  const focusInput = (nextCellValue: any) => {
    // Automatically focus the new cell
    requestAnimationFrame(() => {
      const nextInput = document.querySelector<HTMLInputElement>(`input[name="${nextCellValue}"]`);
      nextInput?.focus();
    });
    setValidateTabShiftInputName(nextCellValue);
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    let currentName: any = e.currentTarget.name;
    console.log(e, e.key, validateTabShiftInputName, currentName)
    if (
      e.shiftKey &&
      e.ctrlKey &&
      e.key === "ArrowDown"
    ) {
      console.log("Shift + Ctrl + ArrowDown detected", currentName);
      nextColName(currentName, 'SCArrowDown');
    } else if (
      e.shiftKey &&
      e.ctrlKey &&
      e.key === "ArrowUp"
    ) {
      nextColName(currentName, 'SCArrowUp');

    } else if (e.ctrlKey && e.key.toLowerCase() === 'a') {
      nextColName(currentName, 'selectAll');
    }

    if (e.key === 'Tab' && e.shiftKey) {
      setValidateTabShiftInputName(currentName);
    }

    if (e.key === 'Enter') {
      if (editModeCell !== currentName) {
        // 1st Enter press → enter edit mode
        setEditModeCell(currentName);
      } else {
        // Parse column (e.g. "B") and row (e.g. "2")
        if (validateTabShiftInputName != '') {
          currentName = validateTabShiftInputName;
        }
        const nextCell: any = nextColName(currentName, '')

        setInputName(nextCell);

        focusInput(nextCell);
      }
    } else if (e.key === 'ArrowDown' || e.key === 'ArrowUp' || e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
      // Handle arrow keys to navigate cells
      e.preventDefault(); // Prevent default scrolling behavior
      let nextCell: any;
      nextCell = nextColName(currentName, e.key)

      if (nextCell) {
        focusInput(nextCell);
      }
    }
  };
  const handleOnClick = (cellKey: string) => () => {
    setValidateTabShiftInputName(cellKey);
    setSelectedCells([]);
    setIsExtendedSelect(false)
  }


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
                      key={key || ''}
                      cellKey={key}
                      value={tableData[key] || ''}
                      onKeyUp={handleKeyPress}
                      onChange={(val) => handleChangeCell(key, val)}
                      onClick={handleOnClick(key)}
                      bold={isHeaderRow}
                      className={selectedCells.includes(key) ? 'bg-blue-200 border-2 border-blue-600' : ''}

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
