import React from "react"
import { useRole } from "../../../context/RoleContext";
import { useEmployees } from "../../../context/EmployeeContext";
import { useNavigate } from "react-router-dom";
import './EmployeeList.scss';

const EmployeeList: React.FC = () => {
    const { role, setRole } = useRole();
    const { employees, deleteEmployee } = useEmployees();
    const navigate = useNavigate();

    const handleDelete = (id: number) => {
        if (role !== 'admin') return;
        deleteEmployee(id);
    };

    const handleLogout = () => {
        setRole(null);
        navigate('/login');
    };

    const canEdit = role === 'admin' || role === 'user';
    const canDelete = role === 'admin';
    const canAdd = role === 'admin';

    return (
        <div className="employee-list p-4">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-xl font-bold">Employee List</h2>
                    <p className="text-sm text-gray-600 mt-1">Logged in as: {role}</p>
                </div>
                <button 
                    onClick={handleLogout}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                    Logout
                </button>
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
                {employees.map((employee) => (
                    <li key={employee.id} className="employee-item border p-2 rounded-lg flex justify-between items-center"> 
                        <div>
                            {employee.name} - {employee.designation} ({employee.email})
                        </div>
                        <div className="space-x-2">
                            {canEdit && (
                                <button 
                                    className="btn bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded" 
                                    onClick={() => navigate(`/employee/edit/${employee.id}`)}
                                >
                                    Edit
                                </button>
                            )}
                            {canDelete && (
                                <button 
                                    className="btn bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded" 
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
}

export default EmployeeList;