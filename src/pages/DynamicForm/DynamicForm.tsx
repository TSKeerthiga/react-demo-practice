import React, { useState } from 'react';
import { AiOutlineEye, AiOutlineEdit, AiFillDelete } from 'react-icons/ai';
import { usePreviewForm } from '../../custom-hooks/usePreviewForm';
import { useDynamicFormBuilder } from '../../custom-hooks/useDynamicFormBuilder';
import { usePreviewContext } from '../../context/PreviewContext';
import { useNavigate } from 'react-router-dom';

const DynamicForm: React.FC = () => {
  const [isPreview, setIsPreview] = useState(false);
  const {
    fields,
    error,
    handleAddField,
    handleFieldChange,
    handleDeleteField,
    handleSubmit,
  } = useDynamicFormBuilder();

  const { setFields: setPreviewFields } = usePreviewContext();
  const navigate = useNavigate();
  const { PreviewComponent } = usePreviewForm({ fields });

  const handleContextPreview = () => {
    setPreviewFields(fields);
    navigate('/preview-context');
  };

  return (
    <div className="max-w-5xl mx-auto p-6 mt-10 border rounded-lg shadow-md bg-white">

      <div className={
        `mx-2 grid 
        ${!isPreview ?
          'lg:grid-cols-4  md:grid-cols-3' : 'lg:grid-cols-3  md:grid-cols-2'}
        grid-cols-1 sm:grid-cols-1 gap-3 mb-8 `
      }>
        <div className='flex justify-center lg:justify-start md:justify-start sm:justify-start col-span-1 lg:col-span-2 md:col-span-1 sm:col-span-1'>
          <h1 className="title sm:text-xl md:text-xl lg:text-3xl xl:text-4xl font-bold text-gray-800">
            Dynamic Form Builder
          </h1>
        </div>

        <div className='flex justify-center lg:justify-end md:justify-end sm:justify-end'>
          <button
            type="button"
            onClick={() => setIsPreview(!isPreview)}
            className="flex items-center gap-2 px-4 py-2 font-medium bg-gradient-to-r from-purple-600 to-purple-800 text-white rounded-lg shadow hover:brightness-110 transition"
          >
            {isPreview ? (
              <>
                <AiOutlineEdit size={18} /> Edit Mode
              </>
            ) : (
              <>
                <AiOutlineEye size={18} /> Preview
              </>
            )}
          </button>
        </div>
        {!isPreview && (
          <div className='flex justify-center lg:justify-end md:justify-end sm:justify-end'>

            <button
              type="button"
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg shadow transition"
              onClick={handleContextPreview}
            >
              Preview Context Page
            </button>

          </div>
        )}
      </div>


      <form onSubmit={handleSubmit} className="space-y-4">
        {isPreview ? (
          <PreviewComponent />
        ) : (
          <div className='overflow-x-auto'>
            <table className="w-full table-auto 
              min-w-[400px] 
              sm:min-w-[640px] 
              md:min-w-[768px] 
              text-left border border-collapse rounded overflow-hidden shadow-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-3 border">Name</th>
                  <th className="p-3 border">Type</th>
                  <th className="p-3 border">Value</th>
                  <th className="p-3 border text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {fields.map((field) => (
                  <tr key={field.id} className="hover:bg-gray-50">
                    <td className="p-3 border">
                      <input
                        type="text"
                        value={field.name}
                        onChange={(e) =>
                          handleFieldChange(field.id, 'name', e.target.value)
                        }
                        className="w-full border rounded p-2 text-sm"
                      />
                      {error[field.name] && (
                        <p className="text-xs text-red-500 mt-1">
                          {error[field.name]}
                        </p>
                      )}
                    </td>
                    <td className="p-3 border">
                      <select
                        value={field.type}
                        onChange={(e) =>
                          handleFieldChange(field.id, 'type', e.target.value)
                        }
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
                      {field.type === 'textarea' ? (
                        <textarea
                          className="w-full border rounded p-2 text-sm"
                          value={field.value}
                          onChange={(e) =>
                            handleFieldChange(field.id, 'value', e.target.value)
                          }
                        />
                      ) : field.type === 'button' ? (
                        <button
                          type="button"
                          className="px-4 py-2 mx-auto bg-blue-500 text-white font-medium rounded-lg shadow transition"
                          disabled
                        >
                          {field.value || 'Submit'}
                        </button>
                      ) : (
                        <input
                          type={field.type}
                          value={field.value}
                          onChange={(e) =>
                            handleFieldChange(field.id, 'value', e.target.value)
                          }
                          className="w-full border rounded p-2 text-sm"
                        />
                      )}
                    </td>
                    <td className="p-3 border text-center">
                      <button
                        type="button"
                        onClick={() => handleDeleteField(field.id)}
                        className="p-2 text-red-600 hover:text-red-800 transition"
                        title="Delete Field"
                      >
                        <AiFillDelete size={20} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {!isPreview && (
          <div className="flex justify-between mt-6">
            <button
              type="button"
              className="px-4 py-2 bg-green-600 text-white font-medium rounded-lg shadow hover:bg-green-700 transition"
              onClick={handleAddField}
            >
              + Add Field
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg shadow hover:bg-blue-700 transition"
            >
              Submit
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

export default DynamicForm;
