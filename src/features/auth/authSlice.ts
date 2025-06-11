import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { loginAPI, logoutAPI } from "./authAPI";
import { mapBackendRole } from "../../data/mapBackendRole";

interface AuthState {
    token: string | null;
    role: string | null;
    username: string | null;
};

const initialState: AuthState = {
    token: localStorage.getItem('token') || null,
    role: localStorage.getItem('userRole') || null,
    username: localStorage.getItem('username') || null,
};

export const loginUser = createAsyncThunk(
    'auth/loginUser', 
    async ({ email, password }: { email: string; password: string }) => {
        const data = await loginAPI(email, password);
        return data;
    }  
);

export const logoutUser = createAsyncThunk(
    'auth/logoutUser',
    async () => {
        console.log("Logging out...");
        return await logoutAPI();
    }
);

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        // Optional: for manual dispatch if needed
        logout: (state) => {
            state.token = null;
            state.role = null;
            state.username = null;
            localStorage.removeItem('token');
            localStorage.removeItem('userRole');
            localStorage.removeItem('username');
        },
    },
    extraReducers: (builder) => {   
        builder.addCase(loginUser.fulfilled, (state, action) => {
            const { token, roles, username } = action.payload;
            const mappedRole = mapBackendRole(roles);

            state.token = token;
            state.role = mappedRole;
            state.username = username;

            localStorage.setItem('token', token);
            if (mappedRole !== null) {
                localStorage.setItem('userRole', mappedRole);
            }
            localStorage.setItem('username', username);
        });

        builder.addCase(loginUser.rejected, (state) => {
            state.token = null;
        });

        // ✅ Add this block to handle thunk-based logout
        builder.addCase(logoutUser.fulfilled, (state) => {
            state.token = null;
            state.role = null;
            state.username = null;
        });
    },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
