'use client';

import React, {createContext, useContext, useState, useEffect} from 'react';
import {refreshToken} from '@/lib/api';
import {
    setAccessToken,
    getAccessToken as getTokenFromService,
    clearAccessToken,
    isAuthenticated as checkIsAuthenticated
} from '@/lib/authService';

interface User {
    username: string;
}

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    login: (user: User, token: string) => void;
    logout: () => void;
    getAccessToken: () => string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({children}) => {
    const [user, setUser] = useState<User | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const login = (userData: User, token: string) => {
        setUser(userData);
        setAccessToken(token);
        setIsAuthenticated(true);
    };

    const logout = () => {
        setUser(null);
        clearAccessToken();
        setIsAuthenticated(false);
    };

    const getAccessToken = () => getTokenFromService();

    useEffect(() => {
        const initAuth = async () => {
            if (checkIsAuthenticated()) {
                try {
                    const {username, accessToken} = await refreshToken();
                    setUser({username});
                    setAccessToken(accessToken);
                    setIsAuthenticated(true);
                } catch (error) {
                    console.error('Failed to refresh token:', error);
                    logout();
                }
            }
        };

        initAuth();
    }, []);

    return (
        <AuthContext.Provider value={{user, isAuthenticated, login, logout, getAccessToken}}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};