import Cell from '../Cell/Cell';
import { SpreadsheetTableProps } from '../types';

const SpreadsheetTable: React.FC<SpreadsheetTableProps> = ({
  rowCount,
  colCount,
  tableData,
  columnLabels,
  getCellKey,
  handleKeyPress,
  handleChangeCell,
  handleOnClick,
  selectedCells
}) => {
  return (
    <div className="overflow-x-auto">
      <table className="table-auto w-full min-w-max border-collapse text-sm sm:text-base md:text-lg">
        <thead>
          <tr>
            <th className="w-10 h-10 bg-gray-100 border border-gray-300"></th>
            {columnLabels.map((label: any, colIndex: number) => (
              <th
                key={colIndex}
                className="min-w-[200px] sm:min-w-[240px] md:min-w-[120px] lg:min-w-[80px] border text-center whitespace-nowrap"
              >
                {label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: rowCount }, (_, rowIndex) => (
            <tr key={rowIndex}>
              <th className="border border-gray-300 bg-gray-100 w-10 text-center font-semibold">
                {rowIndex + 1}
              </th>
              {Array.from({ length: colCount }, (_, colIndex) => {
                const key = getCellKey(rowIndex, colIndex);
                return (
                  <Cell
                    cellKey={key}
                    value={tableData[key] || ''}
                    onKeyUp={handleKeyPress}
                    onChange={(val) => handleChangeCell(key, val)}
                    onClick={(cellKey, _, e) =>
                      e && handleOnClick(cellKey, {
                        shiftKey: e.shiftKey,
                        ctrlKey: e.ctrlKey,
                        altKey: e.altKey
                      }, e)
                    }
                    bold={rowIndex === 0}
                    className={selectedCells.includes(key) ? 'bg-blue-200 border-2 border-blue-600' : ''}
                  />
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SpreadsheetTable;
