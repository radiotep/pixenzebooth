import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const AdminRoute = ({ children }) => {
    const { user, loading } = useAuth();

    if (loading) {
        return <div className="h-screen bg-neutral-900 flex items-center justify-center text-white font-titan animate-pulse">Scanning Bio-metrics...</div>;
    }

    // Admin Access Control
    // Replace with your actual email(s)
    const ADMIN_EMAILS = ['nnvnxx.10@gmail.com', 'admin@sparklebooth.com'];

    if (!user || !ADMIN_EMAILS.includes(user.email)) {
        // Redirect non-admins to home
        return <Navigate to="/" replace />;
    }

    return children;
};

export default AdminRoute;
