import http from "node:http";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const PORT = 3000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const indexPath = path.join(__dirname, "public", "index.html");

// Part A uses an in-memory JavaScript array (No Database).
const cart = [
  { id: 1, productName: "Wireless Mouse", price: 799, quantity: 2 },
  { id: 2, productName: "Keyboard", price: 1299, quantity: 1 },
  { id: 3, productName: "USB Cable", price: 199, quantity: 3 }
];

function sendJson(res, statusCode, data) {
  res.writeHead(statusCode, { "Content-Type": "application/json; charset=utf-8" });
  res.end(JSON.stringify(data, null, 2));
}

function sendText(res, statusCode, message) {
  res.writeHead(statusCode, { "Content-Type": "text/html; charset=utf-8" });
  res.end(message);
}

function isValidProduct(product) {
  return product &&
    Number.isInteger(Number(product.id)) &&
    String(product.productName ?? "").trim().length > 0 &&
    Number.isFinite(Number(product.price)) && Number(product.price) >= 0 &&
    Number.isInteger(Number(product.quantity)) && Number(product.quantity) > 0;
}

async function readJsonBody(req) {
  let rawBody = "";
  for await (const chunk of req) {
    rawBody += chunk;
    if (rawBody.length > 1_000_000) {
      const error = new Error("Request body is too large.");
      error.statusCode = 413;
      throw error;
    }
  }

  try {
    return JSON.parse(rawBody || "{}");
  } catch {
    const error = new Error("Invalid JSON request body.");
    error.statusCode = 400;
    throw error;
  }
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host || "localhost"}`);
  const pathname = url.pathname;

  // A2: Basic routes
  if (req.method === "GET" && pathname === "/") {
    return sendText(res, 200, `
      <!DOCTYPE html>
      <html lang="en">
      <head><meta charset="UTF-8"><title>Shopping Cart</title></head>
      <body>
        <h1>Welcome to Shopping Cart Management</h1>
        <p>Node.js HTTP module practical application.</p>
        <p>Visit <a href="/cart">/cart</a> to view cart items or <a href="/home">/home</a> for the home page.</p>
      </body>
      </html>
    `);
  }

  if (req.method === "GET" && pathname === "/cart") {
    return sendJson(res, 200, cart);
  }

  if (req.method === "GET" && pathname === "/about") {
    return sendText(res, 200, `
      <!DOCTYPE html>
      <html lang="en"><head><meta charset="UTF-8"><title>About</title></head>
      <body><h1>About This Application</h1>
      <p>A simple shopping cart application built with Node.js HTTP and FS modules.</p></body></html>
    `);
  }

  // A4: Serve HTML using the built-in FS module.
  if (req.method === "GET" && pathname === "/home") {
    try {
      const html = await fs.readFile(indexPath, "utf8");
      res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
      return res.end(html);
    } catch (error) {
      console.error("Could not read index.html:", error.message);
      return sendJson(res, 500, { error: "Unable to load the home page." });
    }
  }

  // A3: Add an item using POST /add-to-cart.
  if (req.method === "POST" && pathname === "/add-to-cart") {
    try {
      const product = await readJsonBody(req);

      if (!isValidProduct(product)) {
        return sendJson(res, 400, {
          error: "Required fields: integer id, non-empty productName, non-negative price and positive integer quantity."
        });
      }

      const newProduct = {
        id: Number(product.id),
        productName: String(product.productName).trim(),
        price: Number(product.price),
        quantity: Number(product.quantity)
      };

      if (cart.some(item => item.id === newProduct.id)) {
        return sendJson(res, 409, { error: "A product with this ID already exists." });
      }

      cart.push(newProduct);
      return sendJson(res, 201, {
        message: "Product added to cart successfully.",
        product: newProduct
      });
    } catch (error) {
      return sendJson(res, error.statusCode || 400, { error: error.message });
    }
  }

  // A5: Unknown route.
  return sendJson(res, 404, { error: "Route not found." });
});

server.listen(PORT, () => {
  console.log(`HTTP Server running at http://localhost:${PORT}`);
});
// Part A: HTTP Server Implementation