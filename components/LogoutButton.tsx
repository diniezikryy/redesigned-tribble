'use client'

import {useRouter} from 'next/navigation';
import {clearAccessToken} from '@/lib/authService';

const LogoutButton = () => {
    const router = useRouter();

    const handleLogout = () => {
        clearAccessToken();
        // Here you might want to call an API endpoint to invalidate the refresh token
        router.push('/login');
    };

    return (
        <button onClick={handleLogout}>Logout</button>
    );
};

export default LogoutButton;