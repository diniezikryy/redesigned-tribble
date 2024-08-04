'use client'

import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'

const Header = () => {
    const { user, isAuthenticated, logout } = useAuth();
    const router = useRouter();

    const handleLogout = () => {
        logout();
        router.push('/login');
    };

    return (
        <header style={{
            padding: '1rem',
            backgroundColor: 'green',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
        }}>
            <Link href="/">
                <h1 style={{margin: 0}}>quiz-rizz</h1>
            </Link>
            <div>
                {isAuthenticated && user ? (
                    <>
                        <span style={{marginRight: '1rem'}}>Welcome, {user.username}</span>
                        <button onClick={handleLogout}>Logout</button>
                    </>
                ) : (
                    <Link href="/login">
                        <button>Login</button>
                    </Link>
                )}
            </div>
        </header>
    )
}

export default Header