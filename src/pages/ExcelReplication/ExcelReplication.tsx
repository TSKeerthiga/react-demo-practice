import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
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
  onClick?: (
    cellKey: string,
    modifiers: { shift: boolean; ctrl: boolean; alt: boolean; },
    rawEvent?: React.MouseEvent<HTMLInputElement>
  ) => void;
  className?: string;
};

const parseCell = (cell: string) => {
  const match = cell.match(/^([A-Z]+)(\d+)$/);
  if (!match) return null;
  return { col: match[1], row: parseInt(match[2]) };
};

const getColumnLabel = (index: number): string => {
  let label = "";
  while (index >= 0) {
    label = String.fromCharCode((index % 26) + 65) + label;
    index = Math.floor(index / 26) - 1;
  }
  return label;
};

const getNextCell = (cell: string, direction: string) => {
  const parsed = parseCell(cell);
  if (!parsed) return cell;
  let { row, col } = parsed;
  let colIndex = col.charCodeAt(0) - 65;
  if (direction === "ArrowUp") row = Math.max(1, row - 1);
  if (direction === "ArrowDown") row += 1;
  if (direction === "ArrowLeft") colIndex = Math.max(0, colIndex - 1);
  if (direction === "ArrowRight") colIndex += 1;
  return `${getColumnLabel(colIndex)}${row}`;
};

const getRange = (start: string, end: string): string[] => {
  const a = parseCell(start);
  const b = parseCell(end);
  if (!a || !b) return [];
  const startRow = Math.min(a.row, b.row);
  const endRow = Math.max(a.row, b.row);
  const startCol = Math.min(a.col.charCodeAt(0), b.col.charCodeAt(0));
  const endCol = Math.max(a.col.charCodeAt(0), b.col.charCodeAt(0));

  const cells: string[] = [];
  for (let r = startRow; r <= endRow; r++) {
    for (let c = startCol; c <= endCol; c++) {
      cells.push(`${String.fromCharCode(c)}${r}`);
    }
  }
  return cells;
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
        onClick={(e) => {
          const modifiers = {
            shift: e.shiftKey,
            ctrl: e.ctrlKey,
            alt: e.altKey,
          };
          onClick?.(cellKey, modifiers, e);
        }}
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
  const [isValidateMultiplePress, setIsValidateMultiplePress] = useState(false);
  const [ctrlShiftAnchor, setCtrlShiftAnchor] = useState<string | null>(null);
  const [focusedCell, setFocusedCell] = useState<string>('A1');
  const [anchorCell, setAnchorCell] = useState<string | null>(null);

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
      if (tableData[key] === value) return;

      setTableData((prev) => ({
        ...prev,
        [key]: value,
      }));
    },
    [tableData]
  );

  const handleCtrlShiftArrow = (match: any, direction: string) => {
    const baseKey = ctrlShiftAnchor || `${match[1]}${match[2]}`;
    const anchorMatch = baseKey.match(/^([A-Z]+)(\d+)$/);
    if (!anchorMatch) return;

    const col = anchorMatch[1];
    const row = parseInt(anchorMatch[2]);
    const currentKey = `${col}${row}`;
    const currentVal = tableData[currentKey];
    let selected: string[] = [];

    if (direction === "Down") {
      if (isExtendedSelect && !isValidateMultiplePress) {
        for (let i = row; i <= rowCount; i++) {
          selected.push(`${col}${i}`);
        }
        setIsValidateMultiplePress(true);
      } else if (!isExtendedSelect) {
        setCtrlShiftAnchor(currentKey);
        const matchType = currentVal?.trim() ? "nonEmpty" : "empty";

        for (let i = row; i <= rowCount; i++) {
          const key = `${col}${i}`;
          const val = tableData[key];
          const isNonEmpty = val && val.trim() !== "";

          if (
            (matchType === "nonEmpty" && isNonEmpty) ||
            (matchType === "empty" && !isNonEmpty)
          ) {
            selected.push(key);
          } else {
            break;
          }
        }

        setIsExtendedSelect(true);
      }
    } else if (direction === "Up") {
      if (isExtendedSelect && !isValidateMultiplePress) {
        for (let i = row; i >= 1; i--) {
          selected.push(`${col}${i}`);
        }
        setIsValidateMultiplePress(true);
      } else if (!isExtendedSelect) {
        setCtrlShiftAnchor(currentKey);
        const matchType = currentVal?.trim() ? "nonEmpty" : "empty";

        for (let i = row; i >= 1; i--) {
          const key = `${col}${i}`;
          const val = tableData[key];
          const isNonEmpty = val && val.trim() !== "";

          if (
            (matchType === "nonEmpty" && isNonEmpty) ||
            (matchType === "empty" && !isNonEmpty)
          ) {
            selected.push(key);
          } else {
            break;
          }
        }

        setIsExtendedSelect(true);
      }
    }

    selectCellsAndInput(selected);
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
    selectCellsAndInput(selected);
  };

  const selectCellsAndInput = (selected: any) => {
    if (selected.length > 0) {
      const lastCell = selected[selected.length - 1];
      console.log("lastCell", lastCell)
      setSelectedCells(selected);
      focusInput(lastCell);
      setInputName(lastCell);
    }
  }

  const focusInput = (nextCellValue: any) => {
    // Automatically focus the new cell
    requestAnimationFrame(() => {
      const nextInput = document.querySelector<HTMLInputElement>(`input[name="${nextCellValue}"]`);
      nextInput?.focus();
    });
    setValidateTabShiftInputName(nextCellValue);
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const currentName = e.currentTarget.name;

    if (e.key === 'Enter') {
      e.preventDefault();
      if (editModeCell !== currentName) {
        setEditModeCell(currentName);
      } else {
        const nextCell = getNextCell(currentName, 'ArrowDown');
        setEditModeCell(null);
        setInputName(nextCell);
        focusInput(nextCell);
      }
    } else if (e.shiftKey && e.ctrlKey && e.key === "ArrowDown") {
      handleCtrlShiftArrow(parseCell(currentName), "Down");
    } else if (e.shiftKey && e.ctrlKey && e.key === "ArrowUp") {
      handleCtrlShiftArrow(parseCell(currentName), "Up");
    } else if (e.ctrlKey && e.key.toLowerCase() === 'a') {
      handleSelectAll();
    }
    else if (e.shiftKey && ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
      if (!anchorCell) {
        setAnchorCell(currentName);
      }
      console.log("handle key press function", e.shiftKey)
      const next = getNextCell(currentName, e.key);
      const range = getRange(anchorCell || currentName, next);
      setSelectedCells(range);
      setFocusedCell(next);
      focusInput(next);
      e.preventDefault();
    }
    else if (
      !e.shiftKey &&
      !e.ctrlKey &&
      ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)
    ) {
      e.preventDefault();
      const nextCell = getNextCell(currentName, e.key);
      if (nextCell) {
        focusInput(nextCell);
      }
    } else if (e.key === 'Tab' && e.shiftKey) {
      setValidateTabShiftInputName(currentName);
    }
  };

  const handleOnClick = (
    cellKey: string,
    modifiers: { shift: boolean; ctrl: boolean; alt: boolean; },
    e?: React.MouseEvent<HTMLInputElement>
  ) => {
    const { shift, ctrl, alt } = modifiers;

    console.log("Click on", cellKey, {
      shift,
      ctrl,
      alt,
      anchorCell,
    });
    console.log("modifiers", modifiers, "anchorCell", anchorCell);
    if (shift && anchorCell) {
      console.log("Shift + click detected", cellKey, "anchorCell", anchorCell);
      const newRange = getRange(anchorCell, cellKey);
      setSelectedCells(newRange);
      setFocusedCell(cellKey);
      focusInput(cellKey);

      if (!ctrlShiftAnchor) {
        setCtrlShiftAnchor(anchorCell);
      }

      setIsExtendedSelect(true);
      setIsValidateMultiplePress(false);
    } else {
      setAnchorCell(cellKey);
      setFocusedCell(cellKey);
      setSelectedCells([]);
      setCtrlShiftAnchor(cellKey);
      setIsExtendedSelect(false);
      setIsValidateMultiplePress(false);
    }

    setValidateTabShiftInputName(cellKey);
  };


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
                      onClick={(cellKey, modifiers, e) => handleOnClick(cellKey, modifiers, e)}
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
