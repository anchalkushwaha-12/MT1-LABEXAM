// Part B: Shopping Cart REST API using Express.js
import express from 'express';

const app = express();
const PORT = 4000;

// Middleware to parse JSON request bodies
app.use(express.json());

// Shopping cart stored in a JavaScript array (no database)
let cart = [
  { id: 1, productName: 'Wireless Mouse', price: 799, quantity: 2, category: 'Electronics' },
  { id: 2, productName: 'Notebook', price: 120, quantity: 5, category: 'Stationery' },
  { id: 3, productName: 'Water Bottle', price: 350, quantity: 1, category: 'Home' },
];

// Total price of one item = price x quantity
const withTotal = (item) => ({ ...item, totalPrice: item.price * item.quantity });

// Validate product fields; returns an error message or null
const validateProduct = (p, requireId) => {
  if (!p || typeof p !== 'object') return 'Request body is required';
  if (requireId && p.id === undefined) return 'id is required';
  if (!p.productName || typeof p.productName !== 'string') return 'productName is required';
  if (typeof p.price !== 'number' || p.price < 0) return 'price must be a non-negative number';
  if (!Number.isInteger(p.quantity) || p.quantity <= 0) return 'quantity must be a positive integer';
  if (!p.category || typeof p.category !== 'string') return 'category is required';
  return null;
};

// GET /cart - all items
app.get('/cart', (req, res) => {
  res.json(cart.map(withTotal));
});

// GET /cart/:id - single item
app.get('/cart/:id', (req, res) => {
  const id = Number(req.params.id);
  const item = cart.find((p) => p.id === id);
  if (!item) return res.status(404).json({ error: `Product with id ${req.params.id} not found` });
  res.json(withTotal(item));
});

// POST /cart - add product
app.post('/cart', (req, res) => {
  const error = validateProduct(req.body, true);
  if (error) return res.status(400).json({ error });

  const { id, productName, price, quantity, category } = req.body;
  if (cart.some((p) => p.id === id)) {
    return res.status(409).json({ error: `Product with id ${id} already exists` });
  }

  const product = { id, productName, price, quantity, category };
  cart.push(product);
  res.status(201).json({ message: 'Product added successfully', product });
});

// PUT /cart/:id - update product
app.put('/cart/:id', (req, res) => {
  const id = Number(req.params.id);
  const index = cart.findIndex((p) => p.id === id);
  if (index === -1) return res.status(404).json({ error: `Product with id ${req.params.id} not found` });

  const error = validateProduct(req.body, false);
  if (error) return res.status(400).json({ error });

  const { productName, price, quantity, category } = req.body;
  cart[index] = { id, productName, price, quantity, category };
  res.json({ message: 'Product updated successfully', product: withTotal(cart[index]) });
});

// DELETE /cart/:id - remove product
app.delete('/cart/:id', (req, res) => {
  const id = Number(req.params.id);
  const index = cart.findIndex((p) => p.id === id);
  if (index === -1) return res.status(404).json({ error: `Product with id ${req.params.id} not found` });

  const [removed] = cart.splice(index, 1);
  res.json({ message: 'Product removed successfully', product: removed });
});

// Invalid routes -> 404
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handler (e.g. malformed JSON body)
app.use((err, req, res, next) => {
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ error: 'Invalid JSON in request body' });
  }
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`Express Server running at http://localhost:${PORT}`);
});
