import { Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

const ProtectedRoute = ({ children, roles = [] }) => {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      try {
        const token = localStorage.getItem('token');
        console.log('Checking token:', token ? 'exists' : 'not found');
        
        if (!token) {
          setIsLoading(false);
          return false;
        }

        if (roles.length > 0) {
          const base64Url = token.split('.')[1];
          const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
          const payload = JSON.parse(atob(base64));
          console.log('Token payload:', payload);
          
          const userRole = payload.data.role.toLowerCase();
          console.log('User role:', userRole, 'Required roles:', roles);
          
          if (!roles.includes(userRole)) {
            return false;
          }
        }
        
        return true;
      } catch (error) {
        console.error('Auth check error:', error);
        return false;
      }
    };

    const authorized = checkAuth();
    setIsAuthorized(authorized);
    setIsLoading(false);
  }, [roles]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!isAuthorized) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute;
