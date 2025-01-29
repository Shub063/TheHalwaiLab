import mongoose from 'mongoose'; // Import mongoose

const userSchema = new mongoose.Schema({
  phoneNumber: { type: String, required: true, unique: true },
  isAdmin: { type: Boolean, default: false },
});

const User = mongoose.model('User', userSchema);

export default User; // Export the model
