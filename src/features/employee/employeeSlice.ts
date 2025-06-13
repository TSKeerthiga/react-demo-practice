import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { getApiBaseUrl } from "../../utils/apiUtils";
import { getAuthHeaders } from "../../utils/axiosConfig";
import { RootState } from "../../app/store";

const API_BASE_URL = getApiBaseUrl();

export const fetchEmployees = createAsyncThunk(
    'employee/fetchEmployees',
    async (_, thunkAPI) => {
        const state = thunkAPI.getState() as RootState;
        const response = await axios.get(`${API_BASE_URL}/employees/list`, getAuthHeaders(state));
        return response.data;
    }
);

export const addEmployee = createAsyncThunk(
    'employee/addEmployee',
    async (employeeData: { name: string; email: string; position: string, department: string }, thunkAPI) => {
        const state = thunkAPI.getState() as RootState;

        try {
            const response = await axios.post(`${API_BASE_URL}/employees/create`, employeeData, getAuthHeaders(state));

            return response.data; // This will be used in the reducer to add the new employee to state

        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.response?.data || "Add employee failed");
        }
    }
);

// Update employee by ID
export const updateEmployee = createAsyncThunk(
    'employee/updateEmployee',
    async ({ id, employeeData }: { id: number; employeeData: { name: string; email: string; position: string, department: string } }, thunkAPI) => {
        const state = thunkAPI.getState() as RootState;

        try {
            const response = await axios.put(`${API_BASE_URL}/employees/${id}`, employeeData, getAuthHeaders(state));

            return response.data; // This will be used in the reducer to update the employee in state

        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.response?.data || "Update employee failed");
        }
    }
);

// Delete employee by ID
export const deleteEmployee = createAsyncThunk(
    'employee/deleteEmployee',
    async (id: number, thunkAPI) => {
        const state = thunkAPI.getState() as RootState;
        const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
        if (!API_BASE_URL) throw new Error("Missing API base URL");

        try {
            await axios.delete(`${API_BASE_URL}/employees/${id}`, getAuthHeaders(state));
            return id; // This will be used in the reducer to remove the employee from state

        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.response?.data || "Delete failed");
        }
    }
);

export const fetchEmployWithId = createAsyncThunk(
    'employee/fetchEmployeeById',
    async (id: number, thunkAPI) => {
        const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
        if (!API_BASE_URL) throw new Error("Missing API base URL");
        const  state = thunkAPI.getState() as RootState;

        const response = await axios.get(`${API_BASE_URL}/employees/${id}`, getAuthHeaders(state));

        return response.data; // This will be used in the reducer to fetch employee by ID
    }
);

const employeeSlice = createSlice({
    name: 'employees',   
    initialState: {
        employees: [],
        status: 'idle',
        error: null
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchEmployees.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchEmployees.fulfilled, (state, action) => {
                state.status = 'succeeded';
                // Add any fetched employees to the array
                state.employees = action.payload;
            })
            .addCase(fetchEmployees.rejected, (state: any, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(deleteEmployee.fulfilled, (state, action) => {
                state.employees = state.employees.filter(emp => emp.id !== action.payload);
            })
            .addCase(addEmployee.fulfilled, (state, action) => {
                state.employees.push(action?.payload);
            })
            .addCase(updateEmployee.fulfilled, (state: any, action) => {
                const index = state.employees.findIndex(emp => emp.id === action.payload.id);
                if (index !== -1) {
                    state.employees[index] = action.payload; // Update the employee in the array
                }
            })
            .addCase(addEmployee.rejected, (state, action) => {     
                state.status = 'failed';
                state.error = action.payload as string; // Use the error message from the rejected action
            })
            .addCase(updateEmployee.rejected, (state, action) => {  
                state.status = 'failed';
                state.error = action.payload as string; // Use the error message from the rejected action
            }   )
            .addCase(deleteEmployee.rejected, (state, action) => {          
                state.status = 'failed';
                state.error = action.payload as string; // Use the error message from the rejected action
            });
    },
});

export default employeeSlice.reducer;