'use client'

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { checkAuth } from '../../lib/api';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const verifyAuth = async () => {
            try {
                const isAuth = await checkAuth();
                setIsAuthenticated(isAuth);
                if (!isAuth) {
                    router.push('/login');
                }
            } catch (error) {
                console.error('Auth verification failed:', error);
                router.push('/login');
            }
        };

        verifyAuth();
    }, [router]);

    if (!isAuthenticated) {
        return null;
    }

    return <>{children}</>;
};

export default ProtectedRoute;