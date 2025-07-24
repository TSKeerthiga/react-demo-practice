import React from "react";

interface CellProps {
  cellKey: string;
  value: string;
  onKeyUp: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onChange: (val: string) => void;
  onClick: (
    cellKey: string,
    modifiers: { shift: boolean; ctrl: boolean; alt: boolean },
    e?: React.MouseEvent<HTMLInputElement>
  ) => void;
  bold?: boolean;
  className?: string;
}

const Cell: React.FC<CellProps> = ({
  cellKey,
  value,
  onKeyUp,
  onChange,
  onClick,
  bold = false,
  className = "",
}) => {
  return (
    <td className={`border p-1 ${className}`}>
      <input
        name={cellKey}
        value={value}
        onKeyDown={onKeyUp}
        onChange={(e) => onChange(e.target.value)}
        onClick={(e) =>
          onClick(cellKey, {
            shift: e.shiftKey,
            ctrl: e.ctrlKey,
            alt: e.altKey,
          }, e)
        }
        className={`w-full h-full px-1 outline-none ${bold ? "font-bold" : ""}`}
      />
    </td>
  );
};

export default Cell;