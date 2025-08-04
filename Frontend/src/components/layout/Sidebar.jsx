import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { 
  Home,
  Video,
  Calendar,
  Users,
  BarChart3,
  Settings,
  LogOut,
  Play,
  User,
  Bookmark,
  Clock,
  TrendingUp
} from 'lucide-react';

import PropTypes from 'prop-types';

const Sidebar = ({ userRole }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const adminMenuItems = [
    { icon: Home, label: 'Dashboard', path: '/admin' },
    { icon: Users, label: 'User Management', path: '/admin/users' },
    { icon: Video, label: 'Video Management', path: '/admin/videos' },
    { icon: Calendar, label: 'Event Management', path: '/admin/events' },
    { icon: BarChart3, label: 'Analytics', path: '/admin/analytics' },
    { icon: Settings, label: 'Settings', path: '/admin/settings' },
  ];

  
  const viewerMenuItems = [
    { icon: Home, label: 'Dashboard', path: '/dashboard' },
    { icon: Clock, label: 'Watch History', path: '/history' },
    { icon: User, label: 'Profile', path: '/profile' },
  ];

  const menuItems = userRole === 'admin' ? adminMenuItems : userRole === 'viewer' ? viewerMenuItems : userMenuItems;

  return (
    <div className="h-screen w-64 bg-card border-r flex flex-col shadow-card">
      {/* Logo */}
      <div className="p-6 border-b">
        <Link to={userRole === 'admin' ? '/admin' : '/dashboard'} className="flex items-center space-x-2">
          <div className="p-2 bg-gradient-primary rounded-lg">
            <Play className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold">EventStream</h1>
            <p className="text-sm text-muted-foreground capitalize">{userRole} Panel</p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <div className="flex-1 py-6">
        <nav className="space-y-2 px-4">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-smooth ${
                  isActive
                    ? 'bg-gradient-primary text-white shadow-glow'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
              >
                <Icon className="h-5 w-5" />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* User Info & Logout */}
      <div className="p-4 border-t">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center">
            <User className="h-5 w-5 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate capitalize">
              {userRole || 'User'}
            </p>
            <p className="text-xs text-muted-foreground capitalize">{userRole}</p>
          </div>
        </div>
        
        <Button
          onClick={handleLogout}
          variant="outline"
          className="w-full justify-start text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700 hover:border-red-300"
        >
          <LogOut className="h-4 w-4 mr-2" />
          Logout
        </Button>
      </div>
    </div>
  );
};

Sidebar.propTypes = {
  userRole: PropTypes.oneOf(['admin', 'user', 'viewer']).isRequired
};

export default Sidebar;