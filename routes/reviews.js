const express = require('express');
const router = express.Router();
const db = require('../db/database');

// Add a review
router.post('/', (req, res) => {
  const { user_id, restaurant_id, rating, comment } = req.body;
  db.run(`INSERT INTO reviews (user_id, restaurant_id, rating, comment) VALUES (?, ?, ?, ?)`,
    [user_id, restaurant_id, rating, comment],
    function(err) {
      if (err) return res.status(500).json({ message: 'Failed to submit review' });
      res.status(201).json({ message: 'Review added successfully', reviewId: this.lastID });
    });
});

// Get reviews for a restaurant
router.get('/:restaurantId', (req, res) => {
  const { restaurantId } = req.params;
  db.all(`SELECT users.name as user_name, reviews.rating, reviews.comment 
          FROM reviews 
          JOIN users ON reviews.user_id = users.id
          WHERE restaurant_id = ?`, [restaurantId], (err, rows) => {
    if (err) return res.status(500).json({ message: 'Error fetching reviews' });
    res.json(rows);
  });
});

module.exports = router;
