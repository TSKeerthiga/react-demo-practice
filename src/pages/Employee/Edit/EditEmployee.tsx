import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useEmployees } from '../../../context/EmployeeContext';
import EmployeeForm from '../../../components/EmployeeForm/EmployeeForm';
import type { Employee } from '../../../types/Employee';

const EditEmployee: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { employees, updateEmployee } = useEmployees();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const employeeToEdit = employees.find(emp => emp.id === Number(id));

    const handleSubmit = async (formData: Omit<Employee, 'id'>) => {
        if (!employeeToEdit) return;
        
        try {
            setIsSubmitting(true);
            await updateEmployee({
                ...formData,
                id: employeeToEdit.id
            });
            navigate('/employee');
        } catch (error) {
            console.error('Error updating employee:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCancel = () => {
        navigate('/employee');
    };

    if (!employeeToEdit) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="max-w-md w-full mx-auto px-4 py-8 bg-white rounded-lg shadow-md">
                    <h2 className="text-xl text-red-600 text-center mb-4">Employee not found</h2>
                    <div className="text-center">
                        <button
                            onClick={() => navigate('/employee')}
                            className="inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
                        >
                            Back to Employee List
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
                    initialData={employeeToEdit}
                    onSubmit={handleSubmit}
                    onCancel={handleCancel}
                    title="Edit Employee"
                    isLoading={isSubmitting}
                />
            </div>
        </div>
    );
};

export default EditEmployee;