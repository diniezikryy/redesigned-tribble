'use client';

import {useEffect, useState} from 'react';
import {useRouter} from 'next/navigation';

interface Props {
    children: React.ReactNode;
}

const ProtectedRoute: React.FC<Props> = ({children}) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const access = localStorage.getItem('access');
        if (!access) {
            router.push('/login');
        } else {
            setIsAuthenticated(true);
        }
    }, [router]);

    if (!isAuthenticated) {
        return null;
    }

    return <>{children}</>;
};

export default ProtectedRoute;