import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import './EmployeeList.scss';
import { useAppDispatch, useAppSelector } from "../../../Hook/hooks";
import { deleteEmployee, fetchEmployees } from "../../../features/employee/employeeSlice";
import Header from "../../../components/Header/Header";

const EmployeeList: React.FC = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const employees = useAppSelector((state) => state.employees.employees);
    const username = useAppSelector((state) => state.auth.username);
    const role = useAppSelector((state) => state.auth.role);

    useEffect(() => {
        dispatch(fetchEmployees());
    }, [dispatch]);

    const handleDelete = (id: number) => {
        if (role !== 'admin') return;

        dispatch(deleteEmployee(id))
            .then(() => {
                console.log(`Employee with ID ${id} deleted successfully.`);
                dispatch(fetchEmployees()); // Refresh the list after deletion
            })
            .catch((error: any) => {
                console.error(`Failed to delete employee with ID ${id}:`, error);
            });
    };

    const canEdit = role === 'admin' || role === 'user';
    const canDelete = role === 'admin';
    const canAdd = role === 'admin';

    return (
        <div className="employee-list p-4">
            <Header />

            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">Employee List</h2>
            </div>

            {canAdd && (
                <button
                    className="btn mb-4 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg"
                    onClick={() => navigate('/employee/create')}
                >
                    Create Employee
                </button>
            )}

            <ul className="space-y-2">
                {employees.map((employee: any) => (
                    <li key={employee.id} className="employee-item border p-2 rounded-lg flex justify-between items-center">
                        <div>
                            {employee.name} - {employee.position} ({employee.department})
                        </div>
                        <div className="space-x-2">
                            {canEdit && (
                                <button
                                    className="btn bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-sm"
                                    onClick={() => navigate(`/employee/edit/${employee.id}`)}
                                >
                                    Edit
                                </button>
                            )}
                            {canDelete && (
                                <button
                                    className="btn bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-sm"
                                    onClick={() => handleDelete(employee.id)}
                                >
                                    Delete
                                </button>
                            )}
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default EmployeeList;
