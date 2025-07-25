const express = require('express');
const app = express();
const db = require('./db/database');  // Your SQLite or database connection
const usersRouter = require('./routes/users');
const menuRouter = require('./routes/menu');
const reviewsRouter = require('./routes/reviews');
const ordersRouter = require('./routes/orders');
const deliveryRouter = require('./routes/delivery');

// Setup middleware
app.use(express.json());
app.use(express.static('public'));  // Serving static files like images and CSS

// Use the API routes
app.use('/api/users', usersRouter);
app.use('/api/menu', menuRouter);  // For fetching menu items
app.use('/api/reviews', reviewsRouter);  // For fetching reviews (if implemented)
app.use('/api/orders', ordersRouter);  // For managing orders
app.use('/api/delivery', deliveryRouter);  // For delivery status and tracking

// **Endpoint to place an order**
app.post('/api/orders/create', async (req, res) => {
  const { userId, items } = req.body;

  if (!userId || !items || items.length === 0) {
    return res.status(400).json({ success: false, message: 'Invalid data' });
  }

  try {
    // Insert the order into the database
    const order = await db.run('INSERT INTO orders (user_id, items_list) VALUES (?, ?)', [userId, JSON.stringify(items)]);
    // Return success message and order ID
    res.json({ success: true, orderId: order.lastID });
  } catch (err) {
    console.error('Error placing order:', err);
    res.status(500).json({ success: false, message: 'Failed to place order' });
  }
});

// **Endpoint to fetch order details**
app.get('/api/orders/:orderId', async (req, res) => {
  const { orderId } = req.params;
  try {
    const order = await db.get('SELECT * FROM orders WHERE id = ?', [orderId]);
    if (order) {
      // Send the order details back
      res.json({
        orderId: order.id,
        items: JSON.parse(order.items),
      });
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (err) {
    console.error('Error fetching order details:', err);
    res.status(500).json({ message: 'Failed to fetch order details' });
  }
});

// **Endpoint to confirm payment**
app.post('/api/payment/confirm', async (req, res) => {
  const { orderId } = req.body;

  if (!orderId) {
    return res.status(400).json({ success: false, message: 'Order ID required' });
  }

  try {
    // Update the payment status (add more details if needed)
    const result = await db.run('UPDATE orders SET payment_status = ? WHERE id = ?', ['Paid', orderId]);
    if (result.changes > 0) {
      res.json({ success: true, message: 'Payment confirmed!' });
    } else {
      res.status(404).json({ success: false, message: 'Order not found' });
    }
  } catch (err) {
    console.error('Error confirming payment:', err);
    res.status(500).json({ success: false, message: 'Failed to confirm payment' });
  }
});
// **Endpoint to fetch order details**
app.get('/api/orders/:orderId', async (req, res) => {
  const { orderId } = req.params;
  try {
    const order = await db.get('SELECT * FROM orders WHERE id = ?', [orderId]);
    if (order) {
      res.json({
        orderId: order.id,
        items: JSON.parse(order.items),  // Parse the items as they were stored as JSON
        totalPrice: order.totalPrice,    // If you want to store the total price in the DB
      });
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (err) {
    console.error('Error fetching order details:', err);
    res.status(500).json({ message: 'Failed to fetch order details' });
  }
});
// Example: Fetch user by ID
app.get('/api/user/:id', (req, res) => {
  const userId = req.params.id;
  db.get('SELECT id, name, email, address FROM users WHERE id = ?', [userId], (err, row) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Database error' });
    } else if (!row) {
      res.status(404).json({ error: 'User not found' });
    } else {
      res.json(row);
    }
  });
});


// Set up the server to listen on port 3000
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
