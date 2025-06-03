import React, { createContext, useContext, useState } from 'react';
import { Employee } from '../types/Employee';

interface EmployeeContextType {
    employees: Employee[];
    addEmployee: (employee: Omit<Employee, 'id'>) => Employee;
    updateEmployee: (employee: Employee) => void;
    deleteEmployee: (id: number) => void;
}

const sampleData: Employee[] = [
    { id: 1, name: 'Alice Johnson', email: 'alice@example.com', designation: 'Engineer' },
    { id: 2, name: 'Bob Smith', email: 'bob@example.com', designation: 'Designer' },
    { id: 3, name: 'Charlie Davis', email: 'charlie@example.com', designation: 'Manager' }
];

const EmployeeContext = createContext<EmployeeContextType | null>(null);

export const useEmployees = () => {
    const context = useContext(EmployeeContext);
    if (!context) {
        throw new Error('useEmployees must be used within an EmployeeProvider');
    }
    return context;
};

export const EmployeeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [employees, setEmployees] = useState<Employee[]>(sampleData);

    const addEmployee = (employeeData: Omit<Employee, 'id'>) => {
        const newEmployee = {
            ...employeeData,
            id: Date.now()
        };
        setEmployees(prev => [...prev, newEmployee]);
        return newEmployee;
    };

    const updateEmployee = (updatedEmployee: Employee) => {
        setEmployees(prev => 
            prev.map(emp => 
                emp.id === updatedEmployee.id ? updatedEmployee : emp
            )
        );
    };

    const deleteEmployee = (id: number) => {
        setEmployees(prev => prev.filter(emp => emp.id !== id));
    };

    return (
        <EmployeeContext.Provider value={{
            employees,
            addEmployee,
            updateEmployee,
            deleteEmployee
        }}>
            {children}
        </EmployeeContext.Provider>
    );
};