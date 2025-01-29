// import mongoose from "mongoose";
// import Category from "../models/Category.js";

// export const getCategories = async (req, res) => {
// 	try {
// 		const categories = await Category.find({});
// 		res.status(200).json({ success: true, data: categories });
// 	} catch (error) {
// 		console.log("error in fetching categories:", error.message);
// 		res.status(500).json({ success: false, message: "Server Error" });
// 	}
// };

// export const createCategory = async (req, res) => {
// 	const category = req.body; // user will send this data

// 	if (!category.name || !category.description || !category.imageUrl) {
// 		return res.status(400).json({ success: false, message: "Please provide all fields" });
// 	}

// 	const newCategory = new Category(category);

// 	try {
// 		await newCategory.save();
// 		res.status(201).json({ success: true, data: newCategory });
// 	} catch (error) {
// 		console.error("Error in Create category:", error.message);
// 		res.status(500).json({ success: false, message: "Server Error" });
// 	}
// };

// export const updateCategory = async (req, res) => {
// 	const { id } = req.params;

// 	const category = req.body;

// 	if (!mongoose.Types.ObjectId.isValid(id)) {
// 		return res.status(404).json({ success: false, message: "Invalid category Id" });
// 	}

// 	try {
// 		const updatedCategory = await Category.findByIdAndUpdate(id, category, { new: true });
// 		res.status(200).json({ success: true, data: updatedCategory });
// 	} catch (error) {
// 		res.status(500).json({ success: false, message: "Server Error" });
// 	}
// };

// export const deleteCategory= async (req, res) => {
// 	const { id } = req.params;

// 	if (!mongoose.Types.ObjectId.isValid(id)) {
// 		return res.status(404).json({ success: false, message: "Invalid category Id" });
// 	}

// 	try {
// 		await Category.findByIdAndDelete(id);
// 		res.status(200).json({ success: true, message: "Category deleted" });
// 	} catch (error) {
// 		console.log("error in deleting category:", error.message);
// 		res.status(500).json({ success: false, message: "Server Error" });
// 	}
// };

import mongoose from "mongoose";
import Category from "../models/Category.js";

// Get all categories
// export const getCategories = async (req, res) => {
//   try {
//     const categories = await Category.find({});
//     res.status(200).json({ success: true, data: categories });
//   } catch (error) {
//     console.log("Error in fetching categories:", error.message);
//     res.status(500).json({ success: false, message: "Server Error" });
//   }
// };

export const getCategories = async (req, res) => {
  try {
    const { search } = req.query; 
    const query = {};
    if (search) {
      // Add search filter for product name (case-insensitive)
      query.name = { $regex: search, $options: 'i' };
    }
    const categories = await Category.find(query);
    res.status(200).json({ success: true, data: categories });
  } catch (error) {
    console.log("Error in fetching categories:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};


// Create a new category
export const createCategory = async (req, res) => {
  const category = req.body; // user will send this data

  //console.log("Create: ",category.name, category.description, category.imageUrl);
  
  if (!category.name || !category.description || !category.imageUrl) {
    return res.status(400).json({ success: false, message: "Please provide all fields" });
  }

  const newCategory = new Category({
    name: category.name,
    description: category.description,
    imageUrl: `${category.imageUrl}`,
  });

  try {
    await newCategory.save();
    res.status(201).json({ success: true, data: newCategory });
  } catch (error) {
    console.error("Error in Create category:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Update a category
export const updateCategory = async (req, res) => {
  const { id } = req.params;
  const category = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ success: false, message: "Invalid category Id" });
  }

  try {
    const updatedCategory = await Category.findByIdAndUpdate(id, category, { new: true });
    res.status(200).json({ success: true, data: updatedCategory });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Delete a category
export const deleteCategory = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ success: false, message: "Invalid category Id" });
  }

  try {
    await Category.findByIdAndDelete(id);
    res.status(200).json({ success: true, message: "Category deleted" });
  } catch (error) {
    console.log("Error in deleting category:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
