import mongoose from "mongoose";
import Product from "../models/Product.js";

// Get all products
// export const getProducts = async (req, res) => {
//   try {
//     const products = await Product.find({});
//     res.status(200).json({ success: true, data: products });
//   } catch (error) {
//     console.log("Error in fetching products:", error.message);
//     res.status(500).json({ success: false, message: "Server Error" });
//   }
// };

export const getProducts = async (req, res) => {
  try {
    const { search } = req.query; // Extract search query parameter
    const query = {};
    //console.log("req.query= ",search);
    

    if (search) {
      // Add search filter for product name (case-insensitive)
      query.name = { $regex: search, $options: 'i' };
    }

    const products = await Product.find(query); // Fetch filtered products
    res.status(200).json({ success: true, data: products });
  } catch (error) {
    console.log("Error in fetching products:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const getCategorizedProducts = async (req, res) => {
  try {
    const { search } = req.query;
    const query = search ? { name: { $regex: search, $options: 'i' } } : {};
   
    const products = await Product.find(query);
    //console.log("Total products found:", products.length);
    //console.log("Products:", products);
   
    // Group products by category
    const categorizedProducts = products.reduce((acc, product) => {
      const { category } = product;
      console.log("Processing product:", product.name, "Category:", category);
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(product);
      return acc;
    }, {});
   
    console.log("Categorized Products:", categorizedProducts);
   
    res.status(200).json({
      success: true,
      data: categorizedProducts
    });
  } catch (error) {
    console.log("Error in fetching categorized products:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};


// Create a new product
export const createProduct = async (req, res) => {
  const product = req.body; // user will send this data

  if (!product.name || !product.price || !product.description || !product.category || !product.imageUrl) {
    return res.status(400).json({ success: false, message: "Please provide all fields" });
  }

  const newProduct = new Product({
    name: product.name,
    description: product.description,
    price: product.price,
    category: product.category,
    imageUrl: `${product.imageUrl}`,
  });

  try {
    await newProduct.save();
    res.status(201).json({ success: true, data: newProduct });
  } catch (error) {
    console.error("Error in Create product:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Update a product
export const updateProduct = async (req, res) => {
  const { id } = req.params;
  const product = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ success: false, message: "Invalid Product Id" });
  }

  try {
    const updatedProduct = await Product.findByIdAndUpdate(id, product, { new: true });
    res.status(200).json({ success: true, data: updatedProduct });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Delete a product
export const deleteProduct = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ success: false, message: "Invalid Product Id" });
  }

  try {
    await Product.findByIdAndDelete(id);
    res.status(200).json({ success: true, message: "Product deleted" });
  } catch (error) {
    console.log("Error in deleting product:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
