import React, { useMemo } from "react";

interface ColumnHeadersProps {
  colCount: number;
}

const ColumnHeaders: React.FC<ColumnHeadersProps> = ({ colCount }) => {
  const getColumnLabel = (index: number): string => {
    let label = "";
    while (index >= 0) {
      label = String.fromCharCode((index % 26) + 65) + label;
      index = Math.floor(index / 26) - 1;
    }
    return label;
  };

  const columnLabels = useMemo(() => {
    return Array.from({ length: colCount }, (_, i) => getColumnLabel(i));
  }, [colCount]);

  return (
    <>
      {columnLabels.map((label, colIndex) => (
        <th
          key={colIndex}
          className="min-w-[200px] sm:min-w-[240px] md:min-w-[120px] lg:min-w-[80px] border text-center whitespace-nowrap"
        >
          {label}
        </th>
      ))}
    </>
  );
};

export default ColumnHeaders;
