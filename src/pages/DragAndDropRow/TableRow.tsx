import React from 'react';
import { AiFillDelete } from 'react-icons/ai';
import { Field } from '../../components/DynamicFormField/DynamicFormField';

interface TableRowProps {
  item: Field;
  refProp: React.RefObject<HTMLTableRowElement | null>;
  isDragging: boolean;
  handleFieldChange: (id: string, key: keyof Field, value: string) => void;
  handleDeleteField: (id: string) => void;
  error: Record<string, string>;
}

const TableRow: React.FC<TableRowProps> = ({
  item,
  refProp,
  isDragging,
  handleFieldChange,
  handleDeleteField,
  error,
}) => {
  return (
    <tr
      ref={refProp}
      style={{ opacity: isDragging ? 0.5 : 1, cursor: 'move' }}
      className="hover:bg-gray-50"
    >
      <td className="p-3 border">
        <input
          type="text"
          value={item.name}
          onChange={(e) => handleFieldChange(item.id, 'name', e.target.value)}
          className="w-full border rounded p-2 text-sm"
        />
        {error[item.name] && (
          <p className="text-xs text-red-500 mt-1">{error[item.name]}</p>
        )}
      </td>
      <td className="p-3 border">
        <select
          value={item.type}
          onChange={(e) => handleFieldChange(item.id, 'type', e.target.value)}
          className="w-full border rounded p-2 text-sm"
        >
          <option value="">---Select---</option>
          <option value="text">Text</option>
          <option value="number">Number</option>
          <option value="email">Email</option>
          <option value="textarea">Textarea</option>
          <option value="button">Button</option>
        </select>
      </td>
      <td className="p-3 border">
        {item.type === 'textarea' ? (
          <textarea
            className="w-full border rounded p-2 text-sm"
            value={item.value}
            onChange={(e) => handleFieldChange(item.id, 'value', e.target.value)}
          />
        ) : item.type === 'button' ? (
          <button
            type="button"
            className="px-4 py-2 mx-auto bg-blue-500 text-white font-medium rounded-lg shadow transition"
            disabled
          >
            {item.value || 'Submit'}
          </button>
        ) : (
          <input
            type={item.type}
            value={item.value}
            onChange={(e) => handleFieldChange(item.id, 'value', e.target.value)}
            className="w-full border rounded p-2 text-sm"
          />
        )}
      </td>
      <td className="p-3 border text-center">
        <button
          type="button"
          onClick={() => handleDeleteField(item.id)}
          className="p-2 text-red-600 hover:text-red-800 transition"
          title="Delete Field"
        >
          <AiFillDelete size={20} />
        </button>
      </td>
    </tr>
  );
};

export default TableRow;