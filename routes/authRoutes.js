const express = require('express');
const router = express.Router();
const authMiddleware = require('../auth/authMiddleware');
const jwt = require('jsonwebtoken');

// User model (assuming you have already defined the User model)
const User = require('../models/user');

// Route for user registration
router.post('/register', async (req, res) => {
  try {
    // Implement user registration logic here (e.g., creating a new user in the database).
    // Then generate and send a JWT token for authentication.

    const user = await User.create({
      username: req.body.username,
      // Add other user fields (e.g., password, email, etc.).
    });

    const token = jwt.sign({ id: user.id, username: user.username }, 'your_jwt_secret', { expiresIn: '1h' });
    res.json({ token });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ message: 'Error registering user' });
  }
});

// Route for user login
router.post('/login', async (req, res) => {
  try {
    // Implement user login logic here (e.g., verifying credentials and generating a JWT token).
    // Then send the JWT token in the response.

    const user = await User.findOne({ where: { username: req.body.username } });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check the user's password and generate the token
    // (implement your own password comparison logic, e.g., with bcrypt).

    if (req.body.password === user.password) {
      const token = jwt.sign({ id: user.id, username: user.username }, 'your_jwt_secret', { expiresIn: '1h' });
      res.json({ token });
    } else {
      res.status(401).json({ message: 'Authentication failed' });
    }
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ message: 'Error logging in' });
  }
});

module.exports = router;
