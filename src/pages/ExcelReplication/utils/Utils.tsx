import { CellCoordinates } from "../types";

const parseCell = (cell: string) : CellCoordinates | null => {
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


export { parseCell, getColumnLabel, getNextCell, getRange };