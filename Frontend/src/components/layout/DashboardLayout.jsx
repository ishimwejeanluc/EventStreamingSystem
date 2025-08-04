import React from 'react';
import Sidebar from './Sidebar';
import PropTypes from 'prop-types';

const DashboardLayout = ({ children }) => {
  // Get user role from token
  const getUserRole = () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const payload = JSON.parse(atob(base64));
        return payload.data.role;
      }
    } catch (error) {
      console.error('Error getting user role:', error);
    }
    return null;
  };

  const userRole = getUserRole();

  return (
    <div className="flex h-screen bg-background">
      <Sidebar userRole={userRole} />
      <div className="flex-1 overflow-auto">
        {children}
      </div>
    </div>
  );
};

DashboardLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default DashboardLayout;