import axios from "axios";
import { getApiBaseUrl } from "../../utils/apiUtils";
import { getAuthHeaders } from "../../utils/axiosConfig";
import { RootState } from "../../app/store";

const API_BASE_URL = getApiBaseUrl();

export const loginAPI = async (email: string, password: string) => {

    const response = await axios.post(`${API_BASE_URL}/auth/login`, {
        email,
        password
    });
    console.log("Login response:", response.data);
    return response.data;
};

export const logoutAPI = async (thunkAPI: any) => {
  try {
    const state = thunkAPI.getState() as RootState;

    // Call backend to logout (optional)
    await axios.post(`${API_BASE_URL}/auth/logout`, {}, getAuthHeaders(state));

    return true;
  } catch (error: any) {
    console.error("Logout failed:", error);
    throw error;
  }
};