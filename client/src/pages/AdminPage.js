import React from 'react';
import AdminDashboard from '../components/admin/AdminDashboard';
import { useAuth } from '../contexts/AuthContext';

const AdminPage = () => {
  const { user } = useAuth();

  // return <AdminDashboard isAdmin={user?.isAdmin} />;
  return <AdminDashboard/>;
};

export default AdminPage;
