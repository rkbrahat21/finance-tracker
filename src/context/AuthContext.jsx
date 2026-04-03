import { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const initAuth = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const userData = await api.getMe();
                    setUser(userData);
                } catch (err) {
                    console.error("Auth initialization failed", err);
                    localStorage.removeItem('token');
                }
            }
            setLoading(false);
        };
        initAuth();
    }, []);

    const login = async (credentials) => {
        const { token, user } = await api.login(credentials);
        localStorage.setItem('token', token);
        setUser(user);
        return user;
    };

    const register = async (userData) => {
        const { token, user } = await api.register(userData);
        localStorage.setItem('token', token);
        setUser(user);
        return user;
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
    };

    const updateAvatar = async (formData) => {
        const updatedUser = await api.updateAvatar(formData);
        setUser(prev => ({ ...prev, avatar: updatedUser.avatar }));
        return updatedUser;
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout, updateAvatar }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
