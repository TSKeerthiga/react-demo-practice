import { getColumnLabel } from "./getColumnLabel";

export const createEmptyGrid = (rows: number, cols: number): { [cell: string]: string } => {
  const table: { [cell: string]: string } = {};
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      const cellKey = `${getColumnLabel(j)}${i + 1}`;
      table[cellKey] = '';
    }
  }
  return table;
};
