import React, { createContext, useContext, useState, useEffect } from "react";

export type Role = 'admin' | 'user' | 'viewer' | null;

interface RoleContextType {
    role: Role;
    setRole: (role: Role) => void;
}

const RoleContext = createContext<RoleContextType>({
    role: null,
    setRole: () => {},
});

export const useRole = (): RoleContextType => {
    const context = useContext(RoleContext);
    if (!context) {
        throw new Error('Use Role must be used within a RoleProvider');
    }
    return context;
};

export const RoleProvider: React.FC<{children: React.ReactNode}> = ({children}) => {
    // Initialize role from localStorage or null
    const [role, setRoleState] = useState<Role>(() => {
        const savedRole = localStorage.getItem('userRole');
        return (savedRole as Role) || null;
    });

    // Custom setRole function that also updates localStorage
    const setRole = (newRole: Role) => {
        if (newRole === null) {
            localStorage.removeItem('token');
            localStorage.removeItem('userRole');
            localStorage.removeItem('username');
        } else {
            localStorage.setItem('userRole', newRole);
        }
        setRoleState(newRole);
    };

    return (
        <RoleContext.Provider value={{role, setRole}}>
            {children}
        </RoleContext.Provider>
    );
};
