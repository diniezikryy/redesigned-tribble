'use client'

import { useEffect, useState } from 'react';
import NextLink from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { checkAuth, logout } from '@/lib/api'; // Adjust the import path as needed
import { Button } from "@/components/ui/button";

const Header = () => {
    const [username, setUsername] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        const fetchAuthStatus = async () => {
            try {
                const authData = await checkAuth();

                setUsername(authData.username);
            } catch (error) {
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
        return <div className="h-16 bg-background text-foreground flex items-center justify-center">Loading...</div>;
    }

    const navItems = [
        { href: '/dashboard', label: 'Quizzes' },
        { href: '/attempts', label: 'Attempts' },
    ];

    return (
        <header className="bg-black border-b">
            <div className="container mx-auto px-4 py-4">
                <div className="flex items-center">
                    <div className={`flex`}>
                        <Button asChild variant={`ghost`}>
                            <NextLink href="/" className="text-xl font-bold">
                                3.3 GPA
                            </NextLink>
                        </Button>

                        <nav>
                            <ul className="flex space-x-4">
                                {navItems.map((item) => (
                                    <li key={item.href}>
                                        <Button
                                            asChild
                                            variant={`ghost`}
                                            className={`hover:text-primary transition-colors ${
                                                pathname === item.href ? 'text-primary font-semibold' : 'text-muted-foreground'
                                            }`}
                                        >
                                            <NextLink href={item.href}>{item.label}</NextLink>
                                        </Button>
                                    </li>
                                ))}
                            </ul>
                        </nav>
                    </div>

                    <div className={`ml-auto`}>
                        {username ? (
                            <div className="flex items-center space-x-4">
                                <span className="text-muted-foreground">Welcome, {username}</span>
                                <Button
                                    onClick={handleLogout}
                                    variant="destructive"
                                    size="sm"
                                >
                                    Logout
                                </Button>
                            </div>
                        ) : (
                            <Button asChild>
                                <NextLink href="/login">
                                    <Button variant="secondary" size="sm">Login</Button>
                                </NextLink>
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;