import React, { useState } from 'react';
import { AiOutlineEye, AiOutlineEdit } from 'react-icons/ai';
import { usePreviewForm } from '../../custom-hooks/usePreviewForm';
import { useDynamicFormBuilder } from '../../custom-hooks/useDynamicFormBuilder';
import { usePreviewContext } from '../../context/PreviewContext';
import { useNavigate } from 'react-router-dom';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import TableRow from '../DragAndDropRow/TableRow';
import DraggableRowWrapper from '../DragAndDropRow/DraggableRowWrapper';

const DynamicForm: React.FC = () => {
  const [isPreview, setIsPreview] = useState(false);
  const ITEM_TYPE = 'TABLE_ROW';

  const {
    fields,
    error,
    handleAddField,
    handleFieldChange,
    handleDeleteField,
    setFields,
    handleSubmit,
  } = useDynamicFormBuilder();

  const { setFields: setPreviewFields } = usePreviewContext();
  const navigate = useNavigate();
  const { PreviewComponent } = usePreviewForm({ fields });

  const handleContextPreview = () => {
    setPreviewFields(fields);
    navigate('/preview-context');
  };

  const moveRow = (from: number, to: number) => {
    setFields((prev) => {
      const updated = [...prev];
      const [moved] = updated.splice(from, 1);
      updated.splice(to, 0, moved);
      return updated;
    });
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="max-w-5xl mx-auto p-6 mt-10 border rounded-lg shadow-md bg-white">
        <div
          className={`mx-2 grid 
        ${!isPreview ? 'lg:grid-cols-4  md:grid-cols-3' : 'lg:grid-cols-3  md:grid-cols-2'}
        grid-cols-1 sm:grid-cols-1 gap-3 mb-8`}
        >
          <div className='flex justify-center lg:justify-start md:justify-start col-span-1 lg:col-span-2'>
            <h1 className="title sm:text-xl md:text-xl lg:text-3xl xl:text-4xl font-bold text-gray-800">
              Dynamic Form Builder
            </h1>
          </div>

          <div className='flex justify-center lg:justify-end md:justify-end'>
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
            <div className='flex justify-center lg:justify-end md:justify-end'>
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
              <table className="w-full table-auto min-w-[400px] sm:min-w-[640px] md:min-w-[768px] text-left border border-collapse rounded overflow-hidden shadow-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="p-3 border">Name</th>
                    <th className="p-3 border">Type</th>
                    <th className="p-3 border">Value</th>
                    <th className="p-3 border text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {fields.map((field, idx) => (
                    <DraggableRowWrapper
                      key={field.id}
                      index={idx}
                      moveRow={moveRow}
                      itemType={ITEM_TYPE}
                    >
                      {(ref, isDragging) => (
                        <TableRow
                          refProp={ref}
                          isDragging={isDragging}
                          item={field}
                          handleFieldChange={handleFieldChange}
                          handleDeleteField={handleDeleteField}
                          error={error}
                        />
                      )}
                    </DraggableRowWrapper>
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
    </DndProvider>
  );
};

export default DynamicForm;
