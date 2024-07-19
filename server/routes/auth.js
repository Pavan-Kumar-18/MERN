const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

// Login route
router.post('/login', (req, res) => {
  const { username, password } = req.body;
  // Replace with actual user authentication logic
  if (username === 'user' && password === 'pass') {
    const token = jwt.sign({ user: { id: 1, name: 'User' } }, 'your_jwt_secret', { expiresIn: '1h' });
    return res.json({ token });
  }
  res.status(400).json({ msg: 'Invalid credentials' });
});

module.exports = router;
