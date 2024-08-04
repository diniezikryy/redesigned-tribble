import {useEffect} from 'react';
import {useRouter} from 'next/navigation';
import ProtectedRoute from './ProtectedRoute';

const withAuth = (WrappedComponent: React.ComponentType) => {
    return (props: any) => {
        const router = useRouter();

        useEffect(() => {
            // You can add additional checks here if needed
        }, []);

        return (
            <ProtectedRoute>
                <WrappedComponent {...props} />
            </ProtectedRoute>
        );
    };
};

export default withAuth;