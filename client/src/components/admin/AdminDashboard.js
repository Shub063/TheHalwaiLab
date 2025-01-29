import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import ProductManager from './ProductManager';
import CategoryManager from './CategoryManager';

const AdminDashboard = ({ isAdmin }) => {
  // if (!isAdmin) {
  //   return <Navigate to="/login" replace />;
  // }

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-100">
      <AdminSidebar />
      <div className="flex-1 p-4 md:p-8 overflow-x-auto">
        <Routes>
          {/* Redirect to /admin/products by default */}
          <Route index element={<Navigate to="/admin/products" replace />} />
          <Route path="products" element={<ProductManager />} />
          <Route path="categories" element={<CategoryManager />} />
          {/* <Route path="*" element={
            <div className="text-center text-lg font-bold">
              Page not found.
            </div>
          } /> */}
        </Routes>
      </div>
    </div>
  );
};

export default AdminDashboard;