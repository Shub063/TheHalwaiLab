import express from 'express';
import multer from 'multer';
//import Product from '../models/Product.js'; // Adjust the path to your Product model
import { createProduct, deleteProduct, getProducts, updateProduct, getCategorizedProducts } from "../controllers/productController.js";

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

// Get all products
// router.get('/', async (req, res) => {
//   try {
//     // const products = await Product.find().populate('category');
//     const products = await Product.find();
//     res.json(products);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });

// Add a new product
// router.post('/', upload.single('image'), async (req, res) => {
//   try {
//     const product = new Product({
//       name: req.body.name,
//       description: req.body.description,
//       price: req.body.price,
//       category: req.body.categoryId,
//       imageUrl: req.file ? `/uploads/${req.file.filename}` : null,
//     });
//     const newProduct = await product.save();
//     res.status(201).json(newProduct);
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// });

// Get all products
router.get('/', getProducts);

//Get products based on Category
router.get('/categorized', getCategorizedProducts);

// Add a new product
router.post('/', createProduct);

// Update a product
router.put('/:id', updateProduct);

// Delete a product
router.delete('/:id', deleteProduct);


export default router;
