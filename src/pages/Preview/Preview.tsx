import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Field } from '../../components/DynamicFormField/DynamicFormField';

const Preview: React.FC = () => {
    const { state } = useLocation();
    const navigate = useNavigate();
    const fields = (state as { fields: Field[] })?.fields || [];

    if (fields.length === 0) {
        return (
            <div className="text-center mt-10">
                <p>No form data found.</p>
                <button onClick={() => navigate('/dynamic-form')} className="mt-4 bg-blue-600 text-white px-4 py-2 rounded">
                    Go Back
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-xl mx-auto p-6 mt-8 border rounded shadow">
            <h1 className="text-2xl font-bold mb-4">Preview Submitted Fields</h1>
            <form className="space-y-4">
                {fields.map((field) => (
                    <div key={field.id}>
                        {
                        field.type === 'button' ? (
                            ''
                        ) : (<label className="block text-sm font-medium mb-1">{field.name}</label>)}
                        {field.type === 'button' ? (
                            <button
                                type="button"
                                className="w-full px-4 py-2 bg-blue-600 text-white rounded"
                                onClick={() => alert(`Button "${JSON.stringify(field) || 'Submit'}" clicked — no action taken.`)}
                            >
                                {field.value || 'Submit'}
                            </button>
                        ) : field.type === 'textarea' ? (
                            <textarea className="w-full p-2 border bg-gray-100 rounded" value={field.value} readOnly />
                        ) : (
                            <input className="w-full p-2 border bg-gray-100 rounded" value={field.value} readOnly />
                        )}
                    </div>
                ))}
                <div className="pt-4">
                    <button
                        type="button"
                        onClick={() => navigate('/dynamic-form')}
                        className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
                    >
                        Back to Dynamic Form
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Preview;
