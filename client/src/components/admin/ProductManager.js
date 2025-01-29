import React, { useState, useEffect } from "react";
import api, { uploadImage } from "../../utils/api";
import { useRef } from "react";
import Swal from 'sweetalert2';

const API_URL = process.env.REACT_APP_URL;

const ProductManager = () => {
  // State Management
  const [products, setProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]); // Store all products
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [toast, setToast] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5); // Default to 5 items per page
  const [sortField, setSortField] = useState("name");
  const [sortDirection, setSortDirection] = useState("asc");
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    image: null,
  });
  const [previewUrl, setPreviewUrl] = useState("");
  const [formErrors, setFormErrors] = useState({});

  // Initial Data Loading
  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  // Toast Timer
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        setToast(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  useEffect(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    setProducts(allProducts.slice(startIndex, endIndex));
  }, [currentPage, itemsPerPage, allProducts]);

  const getImageUrl = (path) => {
    if (!path) return "";
    if (path.startsWith("http")) return path;
    if (!API_URL) return path;
    const baseUrl = API_URL.endsWith("/") ? API_URL.slice(0, -1) : API_URL;
    const imagePath = path.startsWith("/") ? path : `/${path}`;
    return `${baseUrl}${imagePath}`;
  };

  // API Functions
  const fetchCategories = async () => {
    try {
      const response = await api.get("/categories");
      setCategories(response.data.data);
    } catch (err) {
      showToast(
        err.response?.data?.message || "Failed to fetch categories",
        "error"
      );
    }
  };

  // const fetchProducts = async (search = "") => {
  //   setLoading(true);
  //   try {
  //     const response = await api.get("/products", {
  //       params: {
  //         sort: `${sortDirection === "desc" ? "-" : ""}${sortField}`,
  //         search: search.trim(),
  //       },
  //     });
  //     setAllProducts(response.data.data); // Store all products
  //     setProducts(response.data.data.slice(0, itemsPerPage)); // Display first page
  //   } catch (err) {
  //     showToast(
  //       err.response?.data?.message || "Failed to fetch products",
  //       "error"
  //     );
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const fetchProducts = async (search = "") => {
    setLoading(true);
    try {
      const response = await api.get("/products", {
        params: {
          sort: `${sortDirection === "desc" ? "-" : ""}${sortField}`,
          search: search.trim(),
        },
      });
      setAllProducts(response.data.data); // Update allProducts
      console.log("Products= ",response.data.data);
      
      const startIndex = (currentPage - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      setProducts(response.data.data.slice(startIndex, endIndex)); // Update products for the current page
    } catch (err) {
      showToast(
        err.response?.data?.message || "Failed to fetch products",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  // Utility Functions
  const showToast = (message, type = "success") => {
    setToast({ message, type });
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.name.trim()) errors.name = "Name is required";
    if (!formData.description.trim())
      errors.description = "Description is required";
    if (!formData.price || formData.price <= 0)
      errors.price = "Valid price is required";
    if (!formData.category) errors.category = "Category is required";
    if (!selectedProduct && !formData.image) errors.image = "Image is required";

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "INR",
    }).format(price);
  };

  // Event Handlers
  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image" && files?.length > 0) {
      const file = files[0];
      if (file.size > 5 * 1024 * 1024) {
        // 5MB limit
        showToast("Image size should be less than 5MB", "error");
        return;
      }
      setFormData((prev) => ({ ...prev, [name]: file }));
      setPreviewUrl(URL.createObjectURL(file));
    } else if (name === "price") {
      const numValue = value.replace(/[^0-9.]/g, "");
      setFormData((prev) => ({ ...prev, [name]: numValue }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
    // Clear error when field is modified
    setFormErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      let imageUrl = "";
      if (formData.image) {
        const uploadResponse = await uploadImage(formData.image);
        imageUrl = uploadResponse.url;
      }

      const productData = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        price: parseFloat(formData.price),
        category: formData.category,
        ...(imageUrl && { imageUrl }),
      };

      if (selectedProduct) {
        await api.put(`/products/${selectedProduct._id}`, productData);
        showToast("Product updated successfully");
      } else {
        await api.post("/products", productData);
        showToast("Product added successfully");
      }

      await fetchProducts();
      resetForm();
      setIsModalOpen(false);
    } catch (err) {
      showToast(err.response?.data?.message || "Operation failed", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation();
  
    // SweetAlert2 confirmation dialog
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this product!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
    });
  
    // If user confirms deletion
    if (result.isConfirmed) {
      setLoading(true);
      try {
        await api.delete(`/products/${id}`);
        await fetchProducts();
        Swal.fire('Deleted!', 'Product deleted successfully.', 'success');
      } catch (err) {
        Swal.fire(
          'Error!',
          err.response?.data?.message || 'Failed to delete product',
          'error'
        );
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
    fetchProducts(searchTerm); // Re-fetch products with new sort
  };

  const searchTimeoutRef = useRef(null);

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    setCurrentPage(1);

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      fetchProducts(value);
    }, 500);
  };

  const handleRowClick = (product) => {
    setSelectedProduct(product);
    const imageUrl = product.imageUrl ? getImageUrl(product.imageUrl) : "";
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      category: product?.category || "",
      image: null,
    });
    setPreviewUrl(imageUrl);
    setIsModalOpen(true);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      price: "",
      category: "",
      image: null,
    });
    setSelectedProduct(null);
    setPreviewUrl("");
    setFormErrors({});
  };

  const handleAddNew = () => {
    resetForm();
    setIsModalOpen(true);
  };

  // Pagination Logic
  // const handlePageChange = (newPage) => {
  //   setCurrentPage(newPage);
  //   const startIndex = (newPage - 1) * itemsPerPage;
  //   const endIndex = startIndex + itemsPerPage;
  //   setProducts(allProducts.slice(startIndex, endIndex));
  // };

  // Pagination handlers
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  // const handleItemsPerPageChange = (e) => {
  //   const newItemsPerPage = parseInt(e.target.value, 10);
  //   setItemsPerPage(newItemsPerPage);
  //   setCurrentPage(1); // Reset to first page
  //   setProducts(allProducts.slice(0, newItemsPerPage));
  // };
  const handleItemsPerPageChange = (e) => {
    const newItemsPerPage = parseInt(e.target.value, 10);
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1); // Reset to first page
  };

  // Render Functions
  const renderSortIcon = (field) => {
    if (sortField !== field) return "↕️";
    return sortDirection === "asc" ? "↑" : "↓";
  };

  return (
    <div className="container mx-auto p-2">
      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed top-4 right-4 p-4 rounded shadow-lg ${
            toast.type === "error" ? "bg-red-500" : "bg-green-500"
          } text-white z-50`}
        >
          {toast.message}
        </div>
      )}

      {/* Main Content */}
      <div className="bg-white rounded-lg shadow-md">
        {/* Header */}
        <div className="p-4 flex flex-col sm:flex-row justify-between items-center border-b gap-4">
          <h2 className="text-xl font-bold">Products</h2>
          <div className="flex gap-4 items-center w-full sm:w-auto">
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={handleSearch}
              className="w-full sm:w-auto px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleAddNew}
              className="bg-[#FFF300] text-[#FF0273] px-4 py-2 rounded-lg hover:text-white hover:bg-[#FF0273] transition-colors duration-200 whitespace-nowrap"
              disabled={loading}
            >
              Add Product
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Sr No.
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Image
                </th>
                <th
                  className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort("name")}
                >
                  Name {renderSortIcon("name")}
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th
                  className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort("category")}
                >
                  Category {renderSortIcon("category")}
                </th>
                <th
                  className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort("price")}
                >
                  Price {renderSortIcon("price")}
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan="7" className="px-4 sm:px-6 py-4 text-center">
                    Loading...
                  </td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-4 sm:px-6 py-4 text-center">
                    No products found
                  </td>
                </tr>
              ) : (
                products.map((product, index) => (
                  <tr
                    key={product._id}
                    className="hover:bg-gray-50 cursor-pointer transition-colors"
                    onClick={() => handleRowClick(product)}
                  >
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                      {(currentPage - 1) * itemsPerPage + index + 1}
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                      <img
                        src={getImageUrl(product.imageUrl)}
                        alt={product.name}
                        className="w-12 h-12 sm:w-16 sm:h-16 object-cover rounded"
                        onError={(e) => {
                          e.target.src = "/placeholder-image.jpg"; // Replace with your placeholder image
                        }}
                      />
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap font-medium">
                      {product.name}
                    </td>
                    <td className="px-4 sm:px-6 py-4">
                      <div className="max-w-xs overflow-hidden text-ellipsis">
                        {product.description}
                      </div>
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                      {product.category || "N/A"}
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                      {formatPrice(product.price)}
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={(e) => handleDelete(product._id, e)}
                        className="text-red-600 hover:text-red-900 transition-colors"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-4 sm:px-6 py-4 flex justify-between items-center border-t">
          {/* Items Per Page Dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-700">Items per page:</span>
            <select
              value={itemsPerPage}
              onChange={handleItemsPerPageChange}
              className="px-2 py-1 border rounded"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
          </div>

          {/* Empty Space */}
          <div className="flex-1"></div>

          {/* Pagination Controls */}
          <div className="flex items-center gap-4">
            {/* Previous Button */}
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1 || loading}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border rounded-md hover:bg-gray-50 disabled:opacity-50"
            >
              Previous
            </button>

            {/* Page Info */}
            <span className="text-sm text-gray-700">
              Page {currentPage} of{" "}
              {Math.ceil(allProducts.length / itemsPerPage)}
            </span>

            {/* Next Button */}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={
                currentPage >= Math.ceil(allProducts.length / itemsPerPage) ||
                loading
              }
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border rounded-md hover:bg-gray-50 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">
                {selectedProduct ? "Edit Product" : "Add New Product"}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={`w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    formErrors.name ? "border-red-500" : ""
                  }`}
                />
                {formErrors.name && (
                  <p className="mt-1 text-sm text-red-500">{formErrors.name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className={`w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    formErrors.description ? "border-red-500" : ""
                  }`}
                  rows="3"
                />
                {formErrors.description && (
                  <p className="mt-1 text-sm text-red-500">
                    {formErrors.description}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Category
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className={`w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    formErrors.category ? "border-red-500" : ""
                  }`}
                >
                  <option value="">Select a category</option>
                  {categories.map((category) => (
                    <option key={category._id} value={category.name}>
                      {category.name}
                    </option>
                  ))}
                </select>
                {formErrors.category && (
                  <p className="mt-1 text-sm text-red-500">
                    {formErrors.category}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Price</label>
                <input
                  type="text"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  placeholder="0.00"
                  className={`w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    formErrors.price ? "border-red-500" : ""
                  }`}
                />
                {formErrors.price && (
                  <p className="mt-1 text-sm text-red-500">
                    {formErrors.price}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Image</label>
                <input
                  type="file"
                  name="image"
                  onChange={handleInputChange}
                  accept="image/*"
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required={!setProducts}
                />
                {previewUrl && (
                  <div className="mt-2">
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="mt-2 h-32 w-full object-cover rounded"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "/placeholder-image.png"; // Add a placeholder image
                      }}
                    />
                  </div>
                )}
              </div>

              <div className="flex gap-2 justify-end pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded transition-colors"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Saving..." : selectedProduct ? "Update" : "Add"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductManager;
