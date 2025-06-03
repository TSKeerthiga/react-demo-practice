import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEmployees } from '../../../context/EmployeeContext';
import EmployeeForm from '../../../components/EmployeeForm/EmployeeForm';
import type { Employee } from '../../../types/Employee';

const AddEmployee: React.FC = () => {
    const navigate = useNavigate();
    const { addEmployee } = useEmployees();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (formData: Omit<Employee, 'id'>) => {
        try {
            setIsSubmitting(true);
            await addEmployee(formData);
            navigate('/employee');
        } catch (error) {
            console.error('Error adding employee:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCancel = () => {
        navigate('/employee');
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <EmployeeForm
                    onSubmit={handleSubmit}
                    onCancel={handleCancel}
                    title="Add New Employee"
                    isLoading={isSubmitting}
                />
            </div>
        </div>
    );
};

export default AddEmployee;