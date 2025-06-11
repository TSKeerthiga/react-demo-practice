import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import EmployeeForm from '../../../components/EmployeeForm/EmployeeForm';
import type { Employee } from '../../../types/Employee';
import { fetchEmployWithId, updateEmployee } from '../../../features/employee/employeeSlice';
import { useAppDispatch } from '../../../Hook/hooks';

const EditEmployee: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    // const { employees, updateEmployee } = useEmployees();
    const dispatch = useAppDispatch();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [employeeToEdit, setEmployeeToEdit] = useState<Employee | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchEmployee = async () => {
            try {
                setIsLoading(true);
                // Simulate fetching employee data
                const response = await dispatch(fetchEmployWithId(Number(id))).unwrap();
                if (response) {
                    setEmployeeToEdit(response);
                } else {
                    setError('Employee not found');
                }
            } catch (err) {
                console.error('Error fetching employee:', err);
                setError('Failed to load employee data.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchEmployee();
    }  , [id, dispatch]);

    const handleSubmit = async (formData: Omit<Employee, 'id'>) => {
        if (!employeeToEdit) return;

        try {
            setIsSubmitting(true);
            await dispatch(updateEmployee({
                id: employeeToEdit.id,
                employeeData: {
                    name: formData.name,
                    email: formData.email,
                    position: formData.position,
                    department: formData.department,
                }
            })).unwrap();
            navigate('/employee');
        } catch (error) {
            console.error('Error updating employee:', error);
            setError('Failed to update employee.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCancel = () => {
        navigate('/employee');
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-xl">Loading...</div>
            </div>
        );
    }

    if (error || !employeeToEdit) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="max-w-md w-full mx-auto px-4 py-8 bg-white rounded-lg shadow-md">
                    <h2 className="text-xl text-red-600 text-center mb-4">{error || 'Employee not found'}</h2>
                    <div className="text-center">
                        <button
                            onClick={() => navigate('/employee')}
                            className="inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
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