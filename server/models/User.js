import mongoose from 'mongoose'; // Import mongoose

const userSchema = new mongoose.Schema({
  emailID: { type: String, required: true, unique: true },
  userName: { type: String, required: true},
  // phoneNumber: { type: String },
  isAdmin: { type: Boolean, default: false },
});

//userSchema.index({ userName: 1 });

const User = mongoose.model('User', userSchema);

export default User; // Export the model
