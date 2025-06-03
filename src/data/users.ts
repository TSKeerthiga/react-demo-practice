interface User {
    username: string;
    password: string;
    role: 'admin' | 'user' | 'viewer';
}

export const users: User[] = [
    {
        username: 'admin@example.com',
        password: 'admin123',
        role: 'admin'
    },
    {
        username: 'user@example.com',
        password: 'user123',
        role: 'user'
    },
    {
        username: 'viewer@example.com',
        password: 'viewer123',
        role: 'viewer'
    }
];

export const validateUser = (username: string, password: string): User | null => {
    const user = users.find(u => u.username === username && u.password === password);
    return user || null;
}; 