// === routes/restaurants.js ===
const express = require('express');
const router = express.Router();
const db = require('../db/database');

// Get all restaurants
router.get('/', (req, res) => {
  db.all(`SELECT * FROM restaurants`, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

module.exports = router;
