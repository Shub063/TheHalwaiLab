import React from "react";

const API_URL = process.env.REACT_APP_URL;

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

const ProductCard = ({ product }) => {
  const handleWhatsAppClick = () => {
    const message = encodeURIComponent(
      `Hi, I'm interested in ordering ${product.name}`
    );
    window.open(`https://wa.me/your-number?text=${message}`);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="relative h-48">
        <img
          src={getImageUrl(product.imageUrl)}
          alt={product.name}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "/placeholder-image.png"; // Add a placeholder image
          }}
        />
      </div>
      <div className="p-4">
        <h3 className="text-xl font-semibold text-gray-800">{product.name}</h3>
        <p className="text-gray-600 mt-2">{product.description}</p>
        <div className="mt-4 flex justify-between items-center">
          <span className="text-lg font-bold text-[#FF0273]">
            ₹{product.price}
          </span>
          <button
            onClick={handleWhatsAppClick}
            className="bg-[#FFF300] text-[#FF0273] px-4 py-2 rounded-lg hover:text-white hover:bg-[#FF0273] transition-colors duration-200"
          >
            Order on WhatsApp
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
