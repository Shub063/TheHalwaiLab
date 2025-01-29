import React from 'react';

const API_URL = process.env.REACT_APP_URL;

const getImageUrl = (path) => {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  if (!API_URL) return path;
  const baseUrl = API_URL.endsWith('/') ? API_URL.slice(0, -1) : API_URL;
  const imagePath = path.startsWith('/') ? path : `/${path}`;
  return `${baseUrl}${imagePath}`;
};

const CategoryCard = ({ category, onClick }) => {
  return (
    <div
      className="bg-white shadow-md rounded-md overflow-hidden cursor-pointer"
      onClick={() => onClick(category.name)}
    >
      <img
        src={getImageUrl(category.imageUrl)}
        alt={category.name}
        className="h-48 w-full object-cover"
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = '/placeholder-image.png';
        }}
      />
      <div className="p-4">
        <h3 className="text-lg font-bold text-gray-800">{category.name}</h3>
        <p className="text-gray-600 text-sm">{category.description}</p>
      </div>
    </div>
  );
};

export default CategoryCard;
