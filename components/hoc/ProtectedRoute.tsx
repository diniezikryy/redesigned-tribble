'use client'

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { checkAuth } from '@/lib/api';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const verifyAuth = async () => {
            try {
                await checkAuth();
                setIsLoading(false);
            } catch (error) {
                console.error('Auth verification failed:', error);
                router.push('/login');
            }
        };

        verifyAuth();
    }, [router]);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return <>{children}</>;
};

export default ProtectedRoute;