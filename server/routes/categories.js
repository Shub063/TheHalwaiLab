import express from 'express';
import multer from 'multer';
import Category from '../models/Category.js'; // Adjust the path to your Category model
import { createCategory, deleteCategory, getCategories, updateCategory } from "../controllers/categoryController.js";

const router = express.Router();

// Multer setup for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage });

// Get all categories
// router.get('/', async (req, res) => {
//   try {
//     const categories = await Category.find();
//     res.json(categories);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });

// Add a new category
// router.post('/', upload.single('image'), async (req, res) => {
//   try {
//     const category = new Category({
//       name: req.body.name,
//       description: req.body.description,
//       imageUrl: req.file ? `/uploads/${req.file.filename}` : null,
//     });
//     const newCategory = await category.save();
//     res.status(201).json(newCategory);
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// });

// Get all categories
router.get('/', getCategories);

// Add a new category
router.post('/', createCategory);

// Update a category
router.put('/:id', updateCategory);

// Delete a category
router.delete('/:id', deleteCategory);

export default router;
