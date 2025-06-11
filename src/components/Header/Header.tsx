import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../Hook/hooks';
import { RootState } from '../../app/store';
import { logoutUser } from '../../features/auth/authSlice';
import { useRole } from '../../context/RoleContext';

const Header: React.FC = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const username = useSelector((state: RootState) => state.auth.username);
    const { setRole } = useRole();

    const handleLogout = async () => {
        try {
            await dispatch(logoutUser()).unwrap();
            setRole(null);
        } catch (err) {
            console.error("Logout API failed:", err);
        } finally {
            localStorage.clear();
            navigate('/login');
        }
    };

    return (
        <header className="flex items-center justify-between px-6 py-4 bg-white shadow-md rounded-2xl mb-6 border border-gray-200">
            <div>
                <h1 className="text-2xl font-bold text-gray-800">Employee Portal</h1>
                <p className="text-sm text-gray-500 mt-1">Welcome, <span className="font-medium text-gray-700">{username}</span></p>
            </div>
            <button
                onClick={handleLogout}
                className="inline-flex items-center px-5 py-2.5 bg-red-500 text-white font-semibold rounded-xl shadow hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-200"
            >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H7a2 2 0 01-2-2V7a2 2 0 012-2h4a2 2 0 012 2v1" />
                </svg>
                Logout
            </button>
        </header>
    );
};

export default Header;
