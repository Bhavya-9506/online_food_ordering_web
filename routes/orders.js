const express = require('express');
const router = express.Router();
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./db/database.db');

// Existing routes...

// ✅ Add this route at the bottom
router.get('/:orderId', async (req, res) => {
  const { orderId } = req.params;
  try {
    db.get('SELECT * FROM orders WHERE id = ?', [orderId], (err, order) => {
      if (err) {
        console.error('DB error:', err);
        return res.status(500).json({ message: 'Internal server error' });
      }

      if (order) {
        res.json({
          orderId: order.id,
          items: JSON.parse(order.items),
          totalPrice: order.totalPrice,
        });
      } else {
        res.status(404).json({ message: 'Order not found' });
      }
    });
  } catch (err) {
    console.error('Error fetching order details:', err);
    res.status(500).json({ message: 'Failed to fetch order details' });
  }
});

module.exports = router;
