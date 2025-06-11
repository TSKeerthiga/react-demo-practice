import { Role } from "../context/RoleContext";

export const mapBackendRole = (backendRole: string): Role => {
    switch (backendRole) {
        case 'ROLE_ADMIN':
            return 'admin';
        case 'ROLE_USER':
            return 'user';
        case 'ROLE_VIEWER':
            return 'viewer';
        default:
            return null;
    }
};