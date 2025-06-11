import React from 'react';
import './App.css'; // Only if you need custom styles, not Tailwind directives
import './index.css';  // This should include Tailwind directives
import { RoleProvider, useRole } from './context/RoleContext';
import { Navigate, Route, Routes } from 'react-router-dom';
import EmployeeList from './pages/Employee/List/EmployeeList';
import AddEmployee from './pages/Employee/Add/AddEmployee';
import EditEmployee from './pages/Employee/Edit/EditEmployee';
import Login from './pages/Login/Login';
import { EmployeeProvider } from './context/EmployeeContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { role } = useRole();
  
  if (role === null) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
};

const PrivateRoute: React.FC<{allowedRoles: string[], children: React.ReactNode}> = ({allowedRoles, children}) => {
  const {role} = useRole();
  if (role === null) {
    return <Navigate to="/login" />;
  }
  return allowedRoles.includes(role) ? <>{children}</> : <Navigate to="/employee" />;
};

const InitialRedirect: React.FC = () => {
  const { role } = useRole();
  console.log('InitialRedirect role:', role);
  return <Navigate to={role ? "/employee" : "/login"} replace />;
};

const LoginRoute: React.FC = () => {
  const { role } = useRole();
  console.log('LoginRoute role:', role);
  if (role) {
    return <Navigate to="/employee" replace />;
  }
  return <Login />;
};

const App: React.FC = () => {
  console.log('BASE_URL:', process.env.REACT_APP_API_BASE_URL);

  return (
    <div className="app-container">
      <RoleProvider>
        <EmployeeProvider>
          <Routes>
            <Route path="/login" element={<LoginRoute />} />
            <Route path="/" element={<InitialRedirect />} />
            
            <Route path="/employee" element={
              <ProtectedRoute>
                <EmployeeList />
              </ProtectedRoute>
            } />
            
            <Route path="/employee/create" element={
              <ProtectedRoute>
                <PrivateRoute allowedRoles={['admin']}>
                  <AddEmployee />
                </PrivateRoute>
              </ProtectedRoute>
            }/>
            
            <Route path="/employee/edit/:id" element={
              <ProtectedRoute>
                <PrivateRoute allowedRoles={['admin', 'user']}>
                  <EditEmployee />
                </PrivateRoute>
              </ProtectedRoute>
            } />
            
            <Route path="*" element={<InitialRedirect />} />
          </Routes>
        </EmployeeProvider>
      </RoleProvider>
    </div>
  );
}

export default App;
