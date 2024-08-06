'use client'

import {useEffect, useState} from 'react';
import Link from 'next/link';
import {useRouter} from 'next/navigation';
import {checkAuth, logout} from '@/lib/api'; // Adjust the import path as needed

const Header = () => {
    const [username, setUsername] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const fetchAuthStatus = async () => {
            try {
                const authData = await checkAuth();
                console.log(authData)
                console.log("Auth data received:", authData.username);  // Add this line
                setUsername(authData.username);
            } catch (error) {
                console.error("Auth check failed:", error);  // Add this line
                setUsername(null);
            } finally {
                setIsLoading(false);
            }
        };

        fetchAuthStatus();
    }, []);

    const handleLogout = async () => {
        try {
            await logout();
            setUsername(null);
            router.push('/login');
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    if (isLoading) {
        return <div className="h-16 bg-gray-800 text-white flex items-center justify-center">Loading...</div>;
    }

    return (
        <header className="bg-gray-800 text-white">
            <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                <Link href="/" className="text-xl font-bold">
                    3.3 GPA
                </Link>
                <div>
                    {username ? (
                        <div className="flex items-center space-x-4">
                            <span>Welcome, {username}</span>
                            <button
                                onClick={handleLogout}
                                className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
                            >
                                Logout
                            </button>
                        </div>
                    ) : (
                        <Link
                            href="/login"
                            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
                        >
                            Login
                        </Link>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;