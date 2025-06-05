import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEmployees } from '../../../context/EmployeeContext';
import EmployeeForm from '../../../components/EmployeeForm/EmployeeForm';
import type { Employee } from '../../../types/Employee';

const AddEmployee: React.FC = () => {
    const navigate = useNavigate();
    const { addEmployee } = useEmployees();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isDirty, setIsDirty] = useState(false);

    // Reset form state when component mounts
    useEffect(() => {
        setError(null);
        setIsSubmitting(false);
        setIsDirty(false);

        // Optional: Navigation guard
        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            if (isDirty && !isSubmitting) {
                e.preventDefault();
                e.returnValue = '';
            }
        };

        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, [isDirty, isSubmitting]);

    const handleSubmit = async (formData: Omit<Employee, 'id'>) => {
        try {
            setError(null);
            setIsSubmitting(true);
            await addEmployee(formData);
            setIsDirty(false);
            navigate('/employee');
        } catch (error) {
            console.error('Error adding employee:', error);
            setError('Failed to add employee. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCancel = () => {
        if (isDirty && !window.confirm('You have unsaved changes. Are you sure you want to leave?')) {
            return;
        }
        navigate('/employee');
    };

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="max-w-md w-full mx-auto px-4 py-8 bg-white rounded-lg shadow-md">
                    <h2 className="text-xl text-red-600 text-center mb-4">{error}</h2>
                    <div className="text-center">
                        <button
                            onClick={() => setError(null)}
                            className="inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
                        >
                            Try Again
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <EmployeeForm
                    onSubmit={handleSubmit}
                    onCancel={handleCancel}
                    title="Add New Employee"
                    isLoading={isSubmitting}
                    onFormChange={() => setIsDirty(true)}
                />
            </div>
        </div>
    );
};

export default AddEmployee;