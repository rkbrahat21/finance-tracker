import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function ProtectedRoute({ children }) {
    const { user, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full pt-20">
                <div className="animate-pulse flex flex-col items-center">
                    <div className="w-12 h-12 border-4 border-yellow-300 border-t-transparent rounded-full animate-spin"></div>
                    <p className="mt-4 text-slate-400 font-medium">Verifying Session...</p>
                </div>
            </div>
        );
    }

    if (!user) {
        // Store the attempted URL to redirect back after login
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return children;
}
