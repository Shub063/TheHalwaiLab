import React, { useState, useEffect } from "react";
import api, { uploadImage } from "../../utils/api"; // adjust the path according to your file structure
import { useRef } from "react";
import Swal from 'sweetalert2';

const API_URL = process.env.REACT_APP_URL;

const CategoryManager = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [toast, setToast] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [sortField, setSortField] = useState("name");
  const [sortDirection, setSortDirection] = useState("asc");
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    image: null,
  });
  const [previewUrl, setPreviewUrl] = useState("");

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        setToast(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
  };

  const fetchCategories = async (search = "") => {
    setLoading(true);
    try {
      const response = await api.get("/categories", {
        params: {
          sort: `${sortDirection === "desc" ? "-" : ""}${sortField}`,
          search: search.trim(), // Use the latest searchTerm
        },
      });
      setCategories(response.data.data);
      console.log("Set categories= ", response.data.data);
    } catch (err) {
      showToast(err.response?.data?.message || err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  const getPaginatedCategories = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return categories.slice(startIndex, endIndex);
  };

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
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
    //setFormErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const getImageUrl = (path) => {
    //console.log("path= ", path);
    //console.log("url= ", API_URL);

    if (!path) return "";
    // If the path is already a complete URL, return it as is
    if (path.startsWith("http")) return path;
    // If API_URL is not defined, try to use relative path
    if (!API_URL) return path;
    // Remove any double slashes when combining URLs
    const baseUrl = API_URL.endsWith("/") ? API_URL.slice(0, -1) : API_URL;
    const imagePath = path.startsWith("/") ? path : `/${path}`;
    //console.log("Image path= ", `${baseUrl}${imagePath}`);

    return `${baseUrl}${imagePath}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.description.trim()) {
      showToast("Name and description are required", "error");
      return;
    }

    setLoading(true);
    try {
      let imageUrl = "";
      // If a new image is uploaded, upload it
      if (formData.image) {
        const uploadResponse = await uploadImage(formData.image);
        imageUrl = uploadResponse.url; // Assuming the image URL is returned
      }

      const categoryData = {
        name: formData.name,
        description: formData.description,
        ...(imageUrl && { imageUrl }), // Only add imageUrl if it's set
      };

      // If editing an existing category
      if (selectedCategory) {
        await api.put(`/categories/${selectedCategory._id}`, categoryData);
      } else {
        // If creating a new category
        await api.post("/categories", categoryData);
      }

      // Fetch categories and reset the form after success
      await fetchCategories();
      resetForm();
      setIsModalOpen(false);
      showToast(
        `Category ${selectedCategory ? "updated" : "added"} successfully`
      );
    } catch (err) {
      showToast(err.response?.data?.message || err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  // const handleDelete = async (id, e) => {
  //   e.stopPropagation();
  //   if (!window.confirm("Are you sure you want to delete this category?"))
  //     return;

  //   setLoading(true);
  //   try {
  //     await api.delete(`/categories/${id}`);
  //     await fetchCategories();
  //     showToast("Category deleted successfully");
  //   } catch (err) {
  //     showToast(err.response?.data?.message || err.message, "error");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handleDelete = async (id, e) => {
    e.stopPropagation();
  
    // SweetAlert2 confirmation dialog
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this category!',
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
        await api.delete(`/categories/${id}`);
        await fetchCategories();
        Swal.fire('Deleted!', 'Category deleted successfully.', 'success');
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

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      image: null,
    });
    setSelectedCategory(null);
    setPreviewUrl("");
  };

  const handleAddNew = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const handleRowClick = (category) => {
    setSelectedCategory(category);
    const imageUrl = category.imageUrl ? getImageUrl(category.imageUrl) : "";
    setFormData({
      name: category.name,
      description: category.description,
      image: null,
    });
    setPreviewUrl(imageUrl);
    setIsModalOpen(true);
  };

  const searchTimeoutRef = useRef(null); // useRef to store the timeout ID

  const handleSearch = (e) => {
    const value = e.target.value; // Get the current input value
    //console.log("Target value= ", value);

    setSearchTerm(value); // Update the state (asynchronous)
    setCurrentPage(1); // Reset the current page to 1

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current); // Clear the previous timeout
    }

    // Pass the current value directly to fetchProducts
    searchTimeoutRef.current = setTimeout(() => {
      fetchCategories(value); // Use the latest value directly
    }, 500);
  };

  // Rest of the component remains the same...
  // (handleRowClick, handleAddNew, resetForm, and the JSX remain unchanged)

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

      <div className="bg-white rounded-lg shadow-md">
        <div className="p-4 flex justify-between items-center border-b">
          <h2 className="text-xl font-bold">Categories</h2>
          <div className="flex gap-4 items-center">
            <input
              type="text"
              placeholder="Search Category..."
              value={searchTerm}
              onChange={handleSearch}
              className="px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleAddNew}
              className="bg-[#FFF300] text-[#FF0273] px-4 py-2 rounded-lg hover:text-white hover:bg-[#FF0273] transition-colors duration-200"
            >
              Add Category
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Sr No.
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Image
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan="7" className="px-6 py-4 text-center">
                    Loading...
                  </td>
                </tr>
              ) : categories.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-4 text-center">
                    No products found
                  </td>
                </tr>
              ) : (
                getPaginatedCategories().map((category, index) => (
                  <tr
                    key={category._id}
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={() => handleRowClick(category)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      {(currentPage - 1) * itemsPerPage + index + 1}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <img
                        src={getImageUrl(category.imageUrl)}
                        alt={category.name}
                        className="w-16 h-16 object-cover rounded"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "/placeholder-image.png"; // Add a placeholder image
                        }}
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap font-medium">
                      {category.name}
                    </td>
                    <td className="px-6 py-4">{category.description}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={(e) => handleDelete(category._id, e)}
                        className="text-red-600 hover:text-red-900"
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
        <div className="px-6 py-4 flex justify-between items-center border-t">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-700">Items per page:</span>
            <select
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value));
                setCurrentPage(1); // Reset to the first page when changing items per page
              }}
              className="px-2 py-1 border rounded"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1 || loading}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border rounded-md hover:bg-gray-50 disabled:opacity-50"
            >
              Previous
            </button>
            <span className="text-sm text-gray-700">
              Page {currentPage} of{" "}
              {Math.ceil(categories.length / itemsPerPage)}
            </span>
            <button
              onClick={() => setCurrentPage((prev) => prev + 1)}
              disabled={
                currentPage >= Math.ceil(categories.length / itemsPerPage) ||
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
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">
                {selectedCategory ? "Edit Category" : "Add New Category"}
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
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                  rows="3"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Image</label>
                <input
                  type="file"
                  name="image"
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  accept="image/*"
                  required={!setSelectedCategory}
                />
                {previewUrl && (
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="mt-2 h-32 w-full object-cover rounded"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/placeholder-image.png"; // Add a placeholder image
                    }}
                  />
                )}
              </div>

              <div className="flex gap-2 justify-end">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors disabled:opacity-50"
                >
                  {loading ? "Saving..." : selectedCategory ? "Update" : "Add"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryManager;
