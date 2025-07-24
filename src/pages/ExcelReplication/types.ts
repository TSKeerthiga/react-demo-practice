// Cell coordinates in the spreadsheet
type CellCoordinates = {
  row: number;
  col: string;
};

// Spreadsheet data model: cellKey (like "A1") -> value
type SpreadsheetData = {
  [cellKey: string]: string;
};

// Selection state: list of selected cell keys
interface SelectionState {
  selectedCells: string[];
  anchorCell: string | null;
}

// Keyboard modifier state
interface Modifiers {
  shiftKey: boolean;
  ctrlKey: boolean;
  altKey: boolean;
}

// Props passed to a Cell component
interface CellProps {
  cellKey: string;
  value: string;
  onKeyUp: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onChange: (val: string) => void;
  onClick: (cellKey: string, modifiers: Modifiers, e: React.MouseEvent) => void;
  bold?: boolean;
  className?: string;
}

// Props passed to SpreadsheetTable component
interface SpreadsheetTableProps {
  rowCount: number;
  colCount: number;
  tableData: SpreadsheetData;
  columnLabels: string[];
  getCellKey: (row: number, col: number) => string;
  handleKeyPress: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  handleChangeCell: (cellKey: string, value: string) => void;
  handleOnClick: (
    cellKey: string,
    modifiers: Modifiers,
    e: React.MouseEvent
  ) => void;
  selectedCells: string[];
}

export type {
  CellCoordinates,
  SpreadsheetData,
  SelectionState,
  Modifiers,
  CellProps,
  SpreadsheetTableProps,
};


interface SpreadsheetTableProps {
  rowCount: number;
  colCount: number;
  tableData: SpreadsheetData;
  columnLabels: string[];
  getCellKey: (row: number, col: number) => string;
  handleKeyPress: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  handleChangeCell: (cellKey: string, value: string) => void;
  handleOnClick: (
    cellKey: string,
    modifiers: { shiftKey: boolean; ctrlKey: boolean; altKey: boolean },
    e: React.MouseEvent
  ) => void;
  selectedCells: string[];
}
