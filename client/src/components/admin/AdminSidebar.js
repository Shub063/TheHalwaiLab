import React, { useState, useEffect, useRef } from 'react';
import { NavLink } from 'react-router-dom';
import { FaBox, FaListAlt } from 'react-icons/fa'; // Import icons from react-icons

const AdminSidebar = () => {
  const [isMobileView, setIsMobileView] = useState(false);
  const sidebarRef = useRef(null);
  const tableContainerRef = useRef(null);

  useEffect(() => {
    const updateSidebarHeight = () => {
      if (sidebarRef.current && tableContainerRef.current) {
        const tableHeight = tableContainerRef.current.offsetHeight;
        sidebarRef.current.style.height = `${tableHeight}px`;
      }
    };

    updateSidebarHeight();
    window.addEventListener('resize', updateSidebarHeight);

    return () => {
      window.removeEventListener('resize', updateSidebarHeight);
    };
  }, []);

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        className="md:hidden fixed bottom-4 right-4 bg-[#FF0273] text-white p-3 rounded-full shadow-lg z-50"
        onClick={() => setIsMobileView(!isMobileView)}
      >
        {isMobileView ? '×' : '☰'}
      </button>

      {/* Sidebar for Desktop */}
      <div ref={sidebarRef} className="hidden md:flex w-64 bg-white shadow-lg flex-col">
        {/* Header */}
        <div className="p-2 border-b border-gray-200">
          {/* <h2 className="text-xl font-bold text-[#FF0273]">Admin Dashboard</h2> */}
        </div>

        {/* Navigation Links */}
        <nav className="flex-1">
          <NavLink
            to="/admin/products"
            className={({ isActive }) =>
              `flex items-center py-3 pl-4 transition-colors duration-200 ${
                isActive
                  ? 'bg-[#FFF300] text-[#FF0273] border-l-4 border-[#FF0273]' // Active styles
                  : 'hover:bg-gray-100' // Default hover styles
              }`
            }
          >
            <FaBox className="mr-3" />
            <span>Product Manager</span>
          </NavLink>
          <NavLink
            to="/admin/categories"
            className={({ isActive }) =>
              `flex items-center py-3 pl-4 transition-colors duration-200 ${
                isActive
                  ? 'bg-[#FFF300] text-[#FF0273] border-l-4 border-[#FF0273]' // Active styles
                  : 'hover:bg-gray-100' // Default hover styles
              }`
            }
          >
            <FaListAlt className="mr-3" />
            <span>Category Manager</span>
          </NavLink>
        </nav>

        {/* Optional: Footer */}
        <div className="p-4 border-t border-gray-200">
          <p className="text-sm text-gray-500">© 2025 The Halwai Lab</p>
        </div>
      </div>

      {/* Mobile Tabs */}
      {isMobileView && (
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white shadow-lg z-40">
          <nav className="flex justify-around p-2">
            <NavLink
              to="/admin/products"
              className={({ isActive }) =>
                `flex flex-col items-center py-2 px-4 rounded-lg transition-colors duration-200 ${
                  isActive
                    ? 'bg-[#FFF300] text-[#FF0273] font-semibold' // Active styles
                    : 'text-gray-700 hover:bg-gray-100' // Default hover styles
                }`
              }
            >
              <FaBox className="mb-1" />
              <span className="text-xs">Products</span>
            </NavLink>
            <NavLink
              to="/admin/categories"
              className={({ isActive }) =>
                `flex flex-col items-center py-2 px-4 rounded-lg transition-colors duration-200 ${
                  isActive
                    ? 'bg-[#FFF300] text-[#FF0273] font-semibold' // Active styles
                    : 'text-gray-700 hover:bg-gray-100' // Default hover styles
                }`
              }
            >
              <FaListAlt className="mb-1" />
              <span className="text-xs">Categories</span>
            </NavLink>
          </nav>
        </div>
      )}

      {/* Table Container */}
      {/* <div ref={tableContainerRef} className="flex-1 overflow-x-auto">
       
      </div> */}
    </>
  );
};

export default AdminSidebar;