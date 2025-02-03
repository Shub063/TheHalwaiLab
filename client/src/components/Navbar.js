import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import api from "../utils/api";

const Navbar = () => {
  const [categories, setCategories] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const { user, logout } = useAuth();
  const [products, setProducts] = useState([]);
  const dropdownRef = useRef(null);

  // Handle clicking outside of dropdown
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsProfileDropdownOpen(false);
      }
    }

    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  const scrollToCategory = (category) => {
    if (window.location.pathname === "/") {
      const categorySection = document.querySelector(
        `section[data-category="${category}"]`
      );
      if (categorySection) {
        categorySection.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchCategorizedProduct();
  }, [user]);

  const fetchCategories = async () => {
    try {
      const response = await api.get("/categories");
      setCategories(response.data.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchCategorizedProduct = async () => {
    try {
      const response = await api.get("/products/categorized");
      setProducts(response.data.data);
    } catch (error) {
      console.error("Error fetching categorized products:", error);
    }
  };

  // Filter categories that have products
  const filteredCategories = categories.filter(
    category => products[category.name] && products[category.name].length > 0
  );

  return (
    <div className="text-[#FF0273]">
      <nav style={{ backgroundColor: '#FFF300' }} className="shadow-lg">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center h-20">
            <Link to="/" className="text-3xl font-bold">
              The Halwai Lab.
            </Link>

            <button
              className="md:hidden focus:outline-none"
              onClick={() => setIsOpen(!isOpen)}
            >
              <span className="block h-0.5 w-6 bg-white mb-1"></span>
              <span className="block h-0.5 w-6 bg-white mb-1"></span>
              <span className="block h-0.5 w-6 bg-white"></span>
            </button>

            <div className="hidden md:flex space-x-2 text-lg items-center">
              {filteredCategories.map((category) => (
                <button
                  key={category._id}
                  onClick={() => scrollToCategory(category.name)}
                  className="hover:bg-[#FF0273] hover:text-white transition-colors duration-200 px-4 py-2 rounded"
                >
                  {category.name}
                </button>
              ))}

              {/* Conditionally render Admin link only for admin users */}
              {user && user.isAdmin && (
                <Link
                  to="/admin"
                  className="hover:bg-[#FF0273] hover:text-white transition-colors duration-200 px-4 py-2 rounded"
                >
                  Admin
                </Link>
              )}

              {user ? (
                <div className="relative" ref={dropdownRef}>
                  <button 
                    onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                    className="flex items-center space-x-2 focus:outline-none"
                  >
                    <img 
                      src={user.photoURL || '/default-avatar.png'} 
                      alt="Profile" 
                      className="w-10 h-10 rounded-full"
                    />
                    <span className="text-sm">▼</span>
                  </button>

                  {isProfileDropdownOpen && (
                    <div 
                      className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg z-50 border border-[#FF0273]"
                    >
                      <div 
                        className="px-4 py-3 border-b border-[#FF0273]"
                      >
                        <p className="text-sm font-medium text-[#FF0273]">{user.displayName}</p>
                        <p className="text-xs text-[#FF0273] opacity-70 truncate">{user.email}</p>
                      </div>
                      <div className="py-1">
                        <button
                          onClick={() => {
                            logout();
                            setIsProfileDropdownOpen(false);
                          }}
                          className="w-full text-left px-4 py-2 text-sm text-[#FF0273] hover:bg-[#FF0273] hover:text-white transition-colors duration-200"
                        >
                          Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  to="/login"
                  className="hover:bg-[#FF0273] hover:text-white transition-colors duration-200 px-4 py-2 rounded"
                >
                  Login
                </Link>
              )}
            </div>
          </div>

          {/* Mobile Navigation */}
          {isOpen && (
            <div className="md:hidden pb-4">
              {filteredCategories.map((category) => (
                <Link
                  key={category._id}
                  to={`/category/${category._id}`}
                  className="block py-2 hover:bg-[#FF0273] hover:text-white transition-colors duration-200 px-4 rounded"
                >
                  {category.name}
                </Link>
              ))}

              {/* Conditionally render Admin link only for admin users in mobile view */}
              {user && user.isAdmin && (
                <Link
                  to="/admin"
                  className="block py-2 hover:bg-[#FF0273] hover:text-white transition-colors duration-200 px-4 rounded"
                >
                  Admin
                </Link>
              )}
              
              {user ? (
                <div>
                  <div className="flex items-center py-2 px-4">
                    <img 
                      src={user.photoURL || '/default-avatar.png'} 
                      alt="Profile" 
                      className="w-10 h-10 rounded-full mr-2"
                    />
                    <div>
                      <p className="font-medium text-[#FF0273]">{user.displayName}</p>
                      <p className="text-xs text-[#FF0273] opacity-70">{user.email}</p>
                    </div>
                  </div>
                  <button
                    onClick={logout}
                    className="block w-full py-2 hover:bg-[#FF0273] hover:text-white transition-colors duration-200 px-4 text-left text-[#FF0273]"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <Link
                  to="/login"
                  className="block py-2 hover:bg-[#FF0273] hover:text-white transition-colors duration-200 px-4 rounded"
                >
                  Login
                </Link>
              )}
            </div>
          )}
        </div>
      </nav>
    </div>
  );
};

export default Navbar;