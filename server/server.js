import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import connectDB from './config/db.js';
import multer from 'multer';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads'); // specify the folder to store uploaded images
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // to prevent file name conflicts
  },
});

const upload = multer({ storage: storage });

// Connect to MongoDB
// connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
import authRoutes from './routes/auth.js';
import categoryRoutes from './routes/categories.js';
import productRoutes from './routes/products.js';
//import  from './routes/products.js';
//import Category from './models/Category.js';

app.use('/api/auth', authRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/products', productRoutes);
app.post('/api/upload', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).send({ message: 'No file uploaded' });
  }
  res.send({ url: `/uploads/${req.file.filename}` });
});

// app.post("/api/categories",async (req,res) => {
//   const category = req.body;
//   console.log("Name: ",category.name, category.description);
  
//   if(!category.name || !category.description){
//     return res.status(400).json({success: false, message:"Please provide all details"});
//   }
//   const newCategory = new Category(category);
//   try{
//     await newCategory.save();
//     res.status(201).json({success:true, data:newCategory});
//   }catch(error){
//     console.error("Error in creating category: ",error.message);
//     return res.status(500).json({success: false, message:"Server error"});
//   }
// });
// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  connectDB();
  console.log(`Server running on port ${PORT}`);
});
