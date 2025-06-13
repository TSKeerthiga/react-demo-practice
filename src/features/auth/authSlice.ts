import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { loginAPI, logoutAPI } from "./authAPI";
import { mapBackendRole } from "../../data/mapBackendRole";

export type Role = 'admin' | 'user' | 'viewer' | null;

interface AuthState {
    token: string | null;
    role: Role;
    username: string | null;
}

const initialState: AuthState = {
    token: null,
    role: null,
    username: null,
};

// Thunk to handle login
export const loginUser = createAsyncThunk(
    'auth/loginUser',
    async ({ email, password }: { email: string; password: string }) => {
        const data = await loginAPI(email, password);
        return data;
    }
);

// Thunk to handle logout
export const logoutUser = createAsyncThunk(
  'auth/logoutUser',
  async (_, thunkAPI) => {
    await logoutAPI(thunkAPI); // Clears server session and redux-persist
    return;
  }
);

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        // Optional: synchronous logout reducer
        logout: (state) => {
            state.token = null;
            state.role = null;
            state.username = null;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(loginUser.fulfilled, (state, action) => {
            const { token, roles, username } = action.payload;
            const mappedRole = mapBackendRole(roles); // e.g., 'ROLE_ADMIN' → 'admin'

            state.token = token;
            state.role = mappedRole;
            state.username = username;
        });

        builder.addCase(loginUser.rejected, (state) => {
            state.token = null;
            state.role = null;
            state.username = null;
        });

        builder.addCase(logoutUser.fulfilled, (state) => {
            state.token = null;
            state.role = null;
            state.username = null;
        });
    },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
