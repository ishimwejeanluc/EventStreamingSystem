import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const expiryTimer = useRef(null);
  const [role, setRole] = useState(null);

  const decodeToken = (token) => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = atob(base64);
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  };

  const login = async (email, password) => {
    try {
      const baseUrl = import.meta.env.VITE_BACKEND_BASE_URL;
      const response = await fetch(`${baseUrl}/Auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (data.status === 'success' && data.token) {
        const decoded = decodeToken(data.token);
        if (decoded && decoded.data.role) {
          localStorage.setItem('token', data.token);
          setRole(decoded.data.role.toLowerCase());

          // Auto logout timer
          const now = Math.floor(Date.now() / 1000); // current time in seconds
          const expiry = decoded.exp; // expiry in seconds
          const timeout = expiry - now;
          if (timeout > 0) {
            if (expiryTimer.current) clearTimeout(expiryTimer.current);
            expiryTimer.current = setTimeout(() => {
              logout();
              navigate('/login', { replace: true });
            }, timeout * 1000 + 1000); // convert to ms, add 1s buffer
          }

          toast({ description: 'Login successful' });
          return {
            success: true,
            role: decoded.data.role.toLowerCase(),
          };
        }
      }

      toast({
        variant: 'destructive',
        description: data.message || 'Login failed',
      });
      return { success: false };
    } catch (error) {
      console.error('Login error:', error);
      toast({
        variant: 'destructive',
        description: 'Login failed due to server error',
      });
      return { success: false };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setRole(null);
    if (expiryTimer.current) clearTimeout(expiryTimer.current);
    toast({ description: 'Logged out successfully' });
  };

  // On mount or location change, check token validity
  useEffect(() => {
    // DEBUG LOGGING
    console.log('[AuthProvider] useEffect:', {
      token: localStorage.getItem('token'),
      pathname: location.pathname
    });
    const token = localStorage.getItem('token');
    const pathname = location.pathname;
    const isPublic = pathname === '/' || pathname === '/login' || pathname === '/register';

    if (!token) {
      if (!isPublic) navigate('/login', { replace: true });
      return;
    }

    const decoded = decodeToken(token);
    if (!decoded || !decoded.exp) {
      logout();
      if (!isPublic) navigate('/login', { replace: true });
      return;
    }

    const expiry = decoded.exp; // in seconds
    const now = Math.floor(Date.now() / 1000); // current time in seconds

    if (now >= expiry) {
      logout();
      if (!isPublic) navigate('/login', { replace: true });
      return;
    }

    // Set role and auto logout timer
    const userRole = decoded.data.role?.toLowerCase();
    setRole(userRole);
    // If on /login or /, and token is valid, redirect to dashboard
    if (isPublic && (pathname === '/' || pathname === '/login')) {
      if (userRole === 'admin') {
        navigate('/admin', { replace: true });
      } else if (userRole === 'viewer') {
        navigate('/dashboard', { replace: true });
      }
    }
    const timeout = expiry - now;
    if (timeout > 0) {
      if (expiryTimer.current) clearTimeout(expiryTimer.current);
      expiryTimer.current = setTimeout(() => {
        logout();
        navigate('/login', { replace: true });
      }, timeout * 1000 + 1000); // convert to ms, add 1s buffer
    }

    return () => {
      if (expiryTimer.current) clearTimeout(expiryTimer.current);
    };
  }, [location]);

  const value = {
    login,
    logout,
    role,
    decodeToken,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
