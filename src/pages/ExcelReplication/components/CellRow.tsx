import React from "react";
import Cell from "../Cell/Cell";

interface CellRowProps {
  rowIndex: number;
  colCount: number;
  getCellKey: (row: number, col: number) => string;
  tableData: Record<string, string>;
  selectedCells: string[];
  onKeyUp: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onChange: (key: string, value: string) => void;
  onClick: (
    cellKey: string,
    modifiers: { shift: boolean; ctrl: boolean; alt: boolean },
    e?: React.MouseEvent<HTMLInputElement>
  ) => void;
}

const CellRow: React.FC<CellRowProps> = ({
  rowIndex,
  colCount,
  getCellKey,
  tableData,
  selectedCells,
  onKeyUp,
  onChange,
  onClick,
}) => {
  return (
    <tr>
      <th className="border border-gray-300 bg-gray-100 w-10 text-center font-semibold">
        {rowIndex + 1}
      </th>
      {Array.from({ length: colCount }, (_, colIndex) => {
        const key = getCellKey(rowIndex, colIndex);
        const isHeaderRow = rowIndex === 0;
        return (
          <Cell
            key={key}
            cellKey={key}
            value={tableData[key] || ""}
            onKeyUp={onKeyUp}
            onChange={(val) => onChange(key, val)}
            onClick={onClick}
            bold={isHeaderRow}
            className={
              selectedCells.includes(key)
                ? "bg-blue-200 border-2 border-blue-600"
                : ""
            }
          />
        );
      })}
    </tr>
  );
};

export default CellRow;