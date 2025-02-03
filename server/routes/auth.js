import express from 'express';
import User from '../models/User.js';

const router = express.Router();

// Google login route
router.post('/google-login', async (req, res) => {
  try {
    const { email, displayName } = req.body;

    // Validate input
    if (!email || !displayName) {
      return res.status(400).json({ message: 'Email & Name are required' });
    }

    // Check if the user already exists by email
    let user = await User.findOne({ emailID: email });

    // If user doesn't exist, create a new one
    if (!user) {
      user = new User({
        emailID: email,
        userName: displayName, // No need to check for uniqueness
        isAdmin: false // Always set isAdmin to false for new users
      });

      await user.save();
    }

    // Return user data
    res.status(200).json({
      user: {
        emailID: user.emailID,
        userName: user.userName,
        isAdmin: user.isAdmin
      }
    });
  } catch (error) {
    console.error('Google login error:', error);
    
    // Handle duplicate key errors properly
    if (error.code === 11000) {
      return res.status(400).json({
        message: 'Email already exists',
        error: error.message
      });
    }

    res.status(500).json({
      message: 'Internal Server Error',
      error: error.message
    });
  }
});

export default router;
