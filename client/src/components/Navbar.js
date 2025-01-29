import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import api from "../utils/api";

const Navbar = () => {
  const [categories, setCategories] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();
  const [products, setProducts] = useState([])

  const scrollToCategory = (category) => {
    // Only scroll if on HomePage
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
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await api.get("/categories");
      //console.log("categories= ", response.data);
      setCategories(response.data.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchCategorizedProduct = async () => {
    try {
      const response = await api.get("/products/categorized");
      setProducts(response.data.data);
      console.log("Categorized= ", response.data.data);
    } catch (error) {
      console.error("Error fetching categorized products:", error);
    }
  };

    // Filter categories that have products
    const filteredCategories = categories.filter(
      category => products[category.name] && products[category.name].length > 0);

  return (
<div className="text-[#FF0273]">
      <nav style={{ backgroundColor: '#FFF300' }} className="shadow-lg">
        <div className="max-w-7xl mx-auto px-4">
          {/* Navbar Container */}
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <Link to="/" className="text-3xl font-bold">
              The Halwai Lab.
            </Link>

            {/* Hamburger Menu (Mobile Only) */}
            <button
              className="md:hidden focus:outline-none"
              onClick={() => setIsOpen(!isOpen)}
            >
              <span className="block h-0.5 w-6 bg-white mb-1"></span>
              <span className="block h-0.5 w-6 bg-white mb-1"></span>
              <span className="block h-0.5 w-6 bg-white"></span>
            </button>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex space-x-2 text-lg">
              {filteredCategories.map((category) => (
                <button
                  key={category._id}
                  onClick={() => scrollToCategory(category.name)}
                  className="hover:bg-[#FF0273] hover:text-white transition-colors duration-200 px-4 py-2 rounded"
                >
                  {category.name}
                </button>
              ))}

              {/* Admin Link */}
              <Link
                to="/admin"
                className="hover:bg-[#FF0273] hover:text-white transition-colors duration-200 px-4 py-2 rounded"
              >
                Admin
              </Link>
            </div>
          </div>

          {/* Mobile Navigation Links (Dropdown) */}
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

              {/* Admin Link in Mobile Menu */}
              <Link
                to="/admin"
                className="block py-2 hover:bg-[#FF0273] hover:text-white transition-colors duration-200 px-4 rounded"
              >
                Admin
              </Link>
            </div>
          )}
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
