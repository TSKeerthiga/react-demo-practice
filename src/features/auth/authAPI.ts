import axios from "axios";
import { getApiBaseUrl } from "../../utils/apiUtils";

const API_BASE_URL = getApiBaseUrl();

export const loginAPI = async (email: string, password: string) => {

    const response = await axios.post(`${API_BASE_URL}/auth/login`, {
        email,
        password
    });
    console.log("Login response:", response.data);
    return response.data;
};

export const logoutAPI = async () => {
    try {
            const token = localStorage.getItem('token');
            await axios.post(`${API_BASE_URL}/auth/logout`, {}, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            // Optional: clear on server success only
            localStorage.removeItem('token');
            localStorage.removeItem('userRole');
            localStorage.removeItem('username');

            return true;
        } catch (error: any) {
                console.log("Login response:", error);

        }
};