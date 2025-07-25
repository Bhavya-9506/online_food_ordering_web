const express = require('express');
const router = express.Router();
const db = require('../db/database');

// Route to get delivery tracking info for an order
router.get('/:orderId', (req, res) => {
  const { orderId } = req.params;

  db.get('SELECT * FROM delivery_tracking WHERE order_id = ?', [orderId], (err, row) => {
    if (err) {
      return res.status(500).json({ message: 'Error fetching delivery data' });
    }
    if (!row) {
      return res.status(404).json({ message: 'Delivery tracking not found for this order' });
    }
    res.json(row);
  });
});

module.exports = router;
