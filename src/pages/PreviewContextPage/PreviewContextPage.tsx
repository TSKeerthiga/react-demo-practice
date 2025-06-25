import React from 'react';
import { usePreviewContext } from '../../context/PreviewContext';
import { useNavigate } from 'react-router-dom';

const PreviewContextPage: React.FC = () => {
  const { fields } = usePreviewContext();
  const navigate = useNavigate();

  const hasButtonField = fields.some((field) => field.type === 'button');

  const handleBack = () => {
    navigate('/dynamic-form');
  };

  return (
    <div className="max-w-2xl mx-auto p-8 mt-10 bg-white border rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h2 className="title text-3xl font-bold text-gray-800 sm:text-xl">Preview (Context)</h2>
        <button
          type="button"
          onClick={handleBack}
          className={`px-4 py-2 rounded-lg font-medium transition bg-gray-700 text-white hover:bg-gray-800`}
        >
          Back to Form
        </button>
      </div>

      {fields.length === 0 ? (
        <p className="text-gray-600 text-center">No fields to preview.</p>
      ) : (
        <div className="space-y-5">
          {fields.map((field) => (
            <div key={field.id}>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                {field.name}
              </label>
              {field.type === 'button' ? (
                <button
                  className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-md shadow-sm cursor-not-allowed"
                  disabled
                >
                  {field.value || 'Submit'}
                </button>
              ) : field.type === 'textarea' ? (
                <textarea
                  className="w-full p-3 border border-gray-300 rounded-md bg-gray-100"
                  value={field.value}
                  readOnly
                />
              ) : (
                <input
                  type={field.type}
                  className="w-full p-3 border border-gray-300 rounded-md bg-gray-100"
                  value={field.value}
                  readOnly
                />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PreviewContextPage;
