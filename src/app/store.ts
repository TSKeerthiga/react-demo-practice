import { configureStore } from "@reduxjs/toolkit";
import authReducer from '../features/auth/authSlice';
import employeeReducer from '../features/employee/employeeSlice';

export const store = configureStore({
  reducer: {
    // Add your reducers here
    // For example, if you have a slice for employees:
    auth: authReducer,
    employees: employeeReducer
  },    
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;