import React, { useState, useEffect, useRef } from "react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import CategoryCard from "../components/CategoryCard";
import ProductCard from "../components/ProductCard";
import api, { uploadImage } from "../utils/api";
import Footer from "./Footer";
import '../App.css';
const API_URL = process.env.REACT_APP_URL;

const HomePage = () => {
  const [categories, setCategories] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [categorizedProducts, setCategorizedProducts] = useState({});

  const categoryRefs = useRef({});

  const fetchCategorizedProduct = async () => {
    try {
      const response = await api.get("/products/categorized");
      setCategorizedProducts(response.data.data);
      //console.log("Categorized= ", response.data.data);
    } catch (error) {
      console.error("Error fetching categorized products:", error);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchFeaturedProducts();
    fetchCategorizedProduct();
  }, []); // Remove categorizedProducts from dependency array
  
  // Remove the nested useEffect for category refs
  useEffect(() => {
    if (Object.keys(categorizedProducts).length > 0) {
      Object.keys(categorizedProducts).forEach((category) => {
        if (!categoryRefs.current[category]) {
          categoryRefs.current[category] = React.createRef();
        }
      });
    }
  }, [categorizedProducts]); 

  // Method to expose refs to context or global state if needed
  //const getCategoryRefs = () => categoryRefs.current;

  const fetchCategories = async () => {
    try {
      //const response = await fetch('/categories');
      const response = await api.get("/categories", {
        params: {},
      });
      //const data = await response.json();
      setCategories(response.data.data);
      console.log("categories= ", response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchFeaturedProducts = async () => {
    try {
      //const response = await fetch('/products');
      //const data = await response.json();
      const response = await api.get("/products", {
        params: {},
      });
      setFeaturedProducts(response.data.data);
    } catch (error) {
      console.error("Error fetching featured products:", error);
    }
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

  const scrollToCategory = (category) => {
    const section = categoryRefs.current[category];
    if (section && section.current) {
      section.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

      // Filter categories that have products
  const filteredCategories = categories.filter(
      category => categorizedProducts[category.name] && categorizedProducts[category.name].length > 0);
  

  return (
<div className="bg-gray-100 min-h-screen">


{/* Floating Ad Badge */}
<div className="fixed z-50 bottom-5 right-5 bg-[#FF0273] text-white p-3 rounded-full shadow-lg cursor-pointer">
  <a href="https://www.instagram.com/yourpage" target="_blank" rel="noopener noreferrer">
    📲 Follow Us!
  </a>
</div>

<Carousel autoPlay infiniteLoop showStatus={false} showThumbs={false} interval={5000}>
  {filteredCategories.map((category) => (
    <div key={category._id} className="h-[450px]">
      <img
        src={getImageUrl(category.imageUrl)}
        alt={category.name}
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
        <h2 className="text-4xl font-bold text-white">{category.name}</h2>
      </div>
    </div>
  ))}

  {/* Ad Slide */}
  <div className="h-[450px] flex items-center justify-center bg-[#FF0273]">
    <h2 className="text-4xl font-bold text-white">
      🌟 Follow Us for Daily Vlogs & Updates! 🚀
    </h2>
  </div>
</Carousel>

{/* Running Ad Banner Section */}

<div className="running-ad-container">
  <div className="running-ad-content">
    📢 Watch Our Daily Vlogs & Follow Us on Social Media! 🎥 🚀 |  
    📢 New Content Every Day – Stay Updated! 🌟 |  
    📢 Follow Now for Exclusive Updates! 🔥 |  
  </div>
</div>


  {/* Categories Section */}
  <section className="py-7 px-4 max-w-8xl mx-auto mt-5">
  {/* Gradient Line with Text */}
  <div className="relative mb-5">
    {/* Gradient Line */}
    <div className="h-0.5 bg-[linear-gradient(90deg,#FFF300,#FF0273,#FFF300)]"></div>
    {/* Text Centered Over the Gradient Line */}
    <h2 className="absolute inset-0 flex items-center justify-center text-3xl font-bold text-[#FF0273] bg-gray-100 px-4 w-fit mx-auto -mt-4">
      Our Categories
    </h2>
  </div>

  {/* Category Cards Grid */}
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
    {filteredCategories.map((category) => (
      <CategoryCard
        key={category._id}
        category={category}
        onClick={scrollToCategory}
      />
    ))}
  </div>
</section>

{/* Mid-page Ad Banner */}
<section className="py-6 px-4 bg-gray-200 text-center my-8">
  <h2 className="text-3xl font-bold text-[#FF0273]">
    🔥 New Vlogs Every Day! Subscribe Now! 🎬
  </h2>
  <p className="text-gray-700 mt-2">Follow us on Instagram & YouTube for updates.</p>
  <a href="https://www.youtube.com/yourchannel" 
     target="_blank" 
     rel="noopener noreferrer" 
     className="mt-4 inline-block bg-[#FF0273] text-white px-5 py-2 rounded-lg shadow-lg hover:bg-[#d00267]">
    🎥 Watch Now
  </a>
</section>


{/* Featured Products Section */}
{Object.entries(categorizedProducts).map(([category, products]) => (
  <section
    key={category}
    ref={categoryRefs.current[category]}
    data-category={category}
    className="py-5 px-4 max-w-8xl mx-auto"
  >
    {/* Gradient Divider with Category Name */}
    <div className="relative flex items-center justify-center mb-3">
      <div className="flex-grow h-0.5 bg-[linear-gradient(90deg,#FFF300,#FF0273,#FFF300)]"></div>
      <span className="mx-4 text-xl font-bold text-[#FF0273]">{category}</span>
      <div className="flex-grow h-0.5 bg-[linear-gradient(90deg,#FFF300,#FF0273,#FFF300)]"></div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {products.map((product) => (
        <ProductCard key={product._id} product={product} />
      ))}
    </div>
  </section>
))}

{/* Final Gradient Divider */}
{/* <div className="h-0.5 bg-gradient-to-r from-indigo-500 to-purple-500"></div> */}

<Footer></Footer>

  {/* Festival Special Section */}
  {/* <section className="py-12 px-4 bg-orange-100">
    <div className="max-w-7xl mx-auto">
      <h2 className="text-3xl font-bold text-gray-800 mb-8">Festival Specials</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      </div>
    </div>
  </section> */}
</div>
  );
};

export default HomePage;
