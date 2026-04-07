import { Navigate } from 'react-router';

import type { User } from '../types/account';
import { Loading } from '../components/loading/loading';

interface ProtectedRouteProps {
    user: User | null;
    loading: boolean;
    children: (user: User) => React.ReactNode;
}

export default function ProtectedRoute({
    user,
    loading,
    children,
}: ProtectedRouteProps) {
    if (loading) {
        return <Loading />;
    }

    if (!user) {
        return <Navigate to="/login" />;
    }

    return children(user);
}
