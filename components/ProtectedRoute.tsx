'use client';

import {useEffect, useState} from 'react';
import {useRouter} from 'next/navigation';
import {checkAuth} from '@/lib/api';

interface Props {
    children: React.ReactNode;
}

const ProtectedRoute: React.FC<Props> = ({children}) => {
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