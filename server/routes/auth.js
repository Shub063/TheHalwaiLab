import express from 'express';
import User from '../models/User.js'; // Adjust path as needed

const router = express.Router();

// Login or register user
router.post('/login', async (req, res) => {
  try {
    const { phoneNumber } = req.body; // Ensure body contains `phoneNumber`
    if (!phoneNumber) {
      return res.status(400).json({ message: 'Phone number is required' });
    }

    let user = await User.findOne({ phoneNumber });
    if (!user) {
      user = new User({ phoneNumber });
      await user.save();
    }
    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
});

export default router;
