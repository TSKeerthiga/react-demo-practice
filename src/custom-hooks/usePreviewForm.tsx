import React from 'react';
import { Field } from '../components/DynamicFormField/DynamicFormField';

interface UsePreviewFormProps {
  fields: Field[];
}

export const usePreviewForm = ({ fields }: UsePreviewFormProps) => {
  const PreviewComponent = () => {
    return (
      <div className="space-y-4 mt-4">
        {fields.map((field) => (
          <div key={field.id} className="mb-4">
            <label className="block text-sm font-medium mb-1">{field.name}</label>
            {field.type === 'textarea' ? (
              <textarea
                className="w-full p-2 border bg-gray-100 rounded"
                value={field.value}
                readOnly
              />
            ) : field.type === 'button' ? (
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 font-medium text-white rounded"
              >
                {field.name || 'Submit'}
              </button>
            ) : (
              <input
                type={field.type}
                className="w-full p-2 border bg-gray-100 rounded"
                value={field.value}
                readOnly
              />
            )}
          </div>
        ))}
      </div>
    );
  };

  return {
    PreviewComponent,
  };
};
