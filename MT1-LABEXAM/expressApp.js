import express from "express";

const app = express();
const PORT = 4000;

// B1: Middleware parses incoming JSON request bodies.
app.use(express.json());

// B3: In-memory cart. No database is used.
let cart = [
  { id: 1, productName: "Wireless Mouse", price: 799, quantity: 2, category: "Electronics" },
  { id: 2, productName: "Mechanical Keyboard", price: 2499, quantity: 1, category: "Electronics" },
  { id: 3, productName: "Water Bottle", price: 399, quantity: 3, category: "Lifestyle" }
];

function isValidProduct(product, requireId = false) {
  if (!product || typeof product !== "object" || Array.isArray(product)) return false;

  const validId = !requireId ||
    (Number.isInteger(Number(product.id)) && Number(product.id) > 0);

  return validId &&
    (product.productName === undefined ||
      (typeof product.productName === "string" && product.productName.trim().length > 0)) &&
    (product.price === undefined ||
      (Number.isFinite(Number(product.price)) && Number(product.price) >= 0)) &&
    (product.quantity === undefined ||
      (Number.isInteger(Number(product.quantity)) && Number(product.quantity) > 0)) &&
    (product.category === undefined ||
      (typeof product.category === "string" && product.category.trim().length > 0));
}

function withTotalPrice(product) {
  return {
    ...product,
    totalPrice: Number((product.price * product.quantity).toFixed(2))
  };
}

// B2: GET all cart items.
app.get("/cart", (req, res) => {
  res.status(200).json(cart.map(withTotalPrice));
});

// B2: GET one cart item by route parameter.
app.get("/cart/:id", (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) {
    return res.status(400).json({ error: "Product ID must be an integer." });
  }

  const product = cart.find(item => item.id === id);
  if (!product) {
    return res.status(404).json({ error: "Product not found." });
  }

  return res.status(200).json(withTotalPrice(product));
});

// B2: POST a new product.
app.post("/cart", (req, res) => {
  const product = req.body;

  if (!isValidProduct(product, true) ||
      product.productName === undefined ||
      product.price === undefined ||
      product.quantity === undefined) {
    return res.status(400).json({
      error: "Provide id, productName, price and quantity with valid values."
    });
  }

  const id = Number(product.id);
  if (cart.some(item => item.id === id)) {
    return res.status(409).json({ error: "A product with this ID already exists." });
  }

  const newProduct = {
    id,
    productName: product.productName.trim(),
    price: Number(product.price),
    quantity: Number(product.quantity),
    category: typeof product.category === "string" && product.category.trim()
      ? product.category.trim()
      : "General"
  };

  cart.push(newProduct);
  return res.status(201).json({
    message: "Product added successfully",
    product: withTotalPrice(newProduct)
  });
});

// B2: PUT updates supplied product fields.
app.put("/cart/:id", (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) {
    return res.status(400).json({ error: "Product ID must be an integer." });
  }

  const productIndex = cart.findIndex(item => item.id === id);
  if (productIndex === -1) {
    return res.status(404).json({ error: "Product not found." });
  }

  const updates = req.body;
  if (!updates || typeof updates !== "object" || Array.isArray(updates) ||
      Object.keys(updates).length === 0 || !isValidProduct(updates)) {
    return res.status(400).json({ error: "Provide valid product fields to update." });
  }

  const allowedFields = ["productName", "price", "quantity", "category"];
  const safeUpdates = {};

  for (const field of allowedFields) {
    if (updates[field] !== undefined) {
      safeUpdates[field] = field === "productName" || field === "category"
        ? updates[field].trim()
        : Number(updates[field]);
    }
  }

  cart[productIndex] = { ...cart[productIndex], ...safeUpdates };
  return res.status(200).json({
    message: "Product updated successfully",
    product: withTotalPrice(cart[productIndex])
  });
});

// B2: DELETE a product by ID (like a list item).
app.delete("/cart/:id", (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) {
    return res.status(400).json({ error: "Product ID must be an integer." });
  }

  const productIndex = cart.findIndex(item => item.id === id);
  if (productIndex === -1) {
    return res.status(404).json({ error: "Product not found." });
  }

  const [deletedProduct] = cart.splice(productIndex, 1);
  return res.status(200).json({
    message: "Product deleted successfully",
    product: withTotalPrice(deletedProduct)
  });
});

// Return JSON for unknown endpoints.
app.use((req, res) => {
  res.status(404).json({ error: "API route not found." });
});

// Handle malformed JSON sent to express.json().
app.use((error, req, res, next) => {
  if (error instanceof SyntaxError && error.status === 400 && "body" in error) {
    return res.status(400).json({ error: "Invalid JSON request body." });
  }
  console.error(error);
  return res.status(500).json({ error: "Internal server error." });
});

app.listen(PORT, () => {
  console.log(`Express Server running at http://localhost:${PORT}`);
});
// Part B: Express Server Implementation
