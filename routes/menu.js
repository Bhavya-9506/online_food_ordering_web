const express = require('express');
const router = express.Router();
const db = require('../db/database');

// Get menu items with restaurant name
router.get('/', (req, res) => {
  db.all(`SELECT menu_items.*, restaurants.name as restaurant_name 
          FROM menu_items
          JOIN restaurants ON menu_items.restaurant_id = restaurants.id`, [], (err, rows) => {
    if (err) return res.status(500).json({ message: 'Error fetching menu items' });
    res.json(rows);
  });
});

module.exports = router;
