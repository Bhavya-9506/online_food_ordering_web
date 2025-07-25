const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const db = require('../db/database');

// Auto-register if user not found
router.post('/login', (req, res) => {
  const { email, password, name = "New User", address = "Not Provided" } = req.body;

  db.get('SELECT * FROM users WHERE email = ?', [email], async (err, user) => {
    if (err) return res.status(500).json({ message: 'Database error' });

    if (user) {
      const match = await bcrypt.compare(password, user.password);
      if (match) {
        return res.json({ message: 'Login successful', userId: user.id });
      } else {
        return res.status(401).json({ message: 'Incorrect password' });
      }
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);
      db.run(
        'INSERT INTO users (name, email, password, address) VALUES (?, ?, ?, ?)',
        [name, email, hashedPassword, address],
        function (err) {
          if (err) return res.status(500).json({ message: 'Registration failed' });
          return res.json({ message: 'Registered and logged in', userId: this.lastID });
        }
      );
    }
  });
});

module.exports = router;
