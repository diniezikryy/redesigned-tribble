'use client'

import {useEffect} from 'react';
import {useRouter} from 'next/navigation';
import ProtectedRoute from './ProtectedRoute';

const withAuth = <P extends object>(WrappedComponent: React.ComponentType<P>) => {
    // Define a generic type parameter P for the component's props
    // The returned component should accept the same props as the wrapped component
    const WithAuthComponent = (props: P) => {
        const router = useRouter();

        useEffect(() => {
        }, []);

        return (
            <ProtectedRoute>
                <WrappedComponent {...props} />
            </ProtectedRoute>
        );
    };

    // Copy display name for better debugging
    WithAuthComponent.displayName = `withAuth(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;

    return WithAuthComponent;
};

export default withAuth;