// src/utils/api.ts
export const getApiBaseUrl = (): string => {
    const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
    if (!API_BASE_URL) {
        throw new Error("Missing API base URL");
    }
    return API_BASE_URL;
};
