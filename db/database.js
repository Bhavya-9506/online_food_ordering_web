const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database.db');

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    email TEXT,
    password TEXT,
    address TEXT
  )`);

 db.run(`CREATE TABLE IF NOT EXISTS orders (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER,
  items_list TEXT,
  totalPrice REAL,
  paymentMethod TEXT,
  createdAT DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
)`);



  db.run(`CREATE TABLE IF NOT EXISTS restaurants (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    location TEXT,
    description TEXT
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS menu_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    restaurant_id INTEGER,
    item_name TEXT,
    price REAL,
    image_url TEXT,
    FOREIGN KEY (restaurant_id) REFERENCES restaurants(id)
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS reviews (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    restaurant_id INTEGER,
    rating INTEGER,
    comment TEXT,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (restaurant_id) REFERENCES restaurants(id)
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS payments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_id INTEGER,
    method TEXT,
    status TEXT,
    amount REAL,
    payment_date TEXT,
    FOREIGN KEY (order_id) REFERENCES orders(id)
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS delivery_tracking (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_id INTEGER,
    status TEXT,
    estimated_delivery TEXT,
    FOREIGN KEY (order_id) REFERENCES orders(id)
  )`);

  // Add one sample restaurant if none exists
  db.get("SELECT COUNT(*) as count FROM restaurants", (err, row) => {
    if (row.count === 0) {
      db.run(`INSERT INTO restaurants (name, location, description) VALUES
        ('Tandoori Delight', 'Delhi', 'Authentic North Indian Cuisine')`);
    }
  });

  // Add menu items only if not already present
  db.get("SELECT COUNT(*) as count FROM menu_items", (err, row) => {
    if (row.count === 0) {
      db.run(`INSERT INTO menu_items (restaurant_id, item_name, price, image_url)
      VALUES 
      (1, 'Paneer Butter Masala', 9.99, 'https://www.archanaskitchen.com/images/archanaskitchen/1-Author/shaheen_ali/Paneer_Butter_Masala.jpg'),
      (1, 'Chicken Biryani', 11.49, 'https://www.cubesnjuliennes.com/wp-content/uploads/2020/12/Chicken-Biryani-Recipe.jpg'),
      (1, 'Masala Dosa', 4.99, 'https://www.indianhealthyrecipes.com/wp-content/uploads/2021/06/masala-dosa.jpg'),
      (1, 'Chole Bhature', 6.49, 'https://www.vegrecipesofindia.com/wp-content/uploads/2012/11/chole-bhature-recipe-1-500x500.jpg'),
      (1, 'Gulab Jamun', 3.00, 'https://www.cookwithmanali.com/wp-content/uploads/2019/10/Gulab-Jamun-Recipe.jpg')
      `);
    }
  });
});

module.exports = db;
