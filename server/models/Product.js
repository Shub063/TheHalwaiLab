import mongoose from 'mongoose'; // Import mongoose

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  price: { type: Number, required: true },
  category:{type: String, required: true },
  category_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
  imageUrl: String,
});

const Product = mongoose.model('Product', productSchema);

export default Product; // Export the model
