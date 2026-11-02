// Part A: HTTP Module and Server Creation (no Express here)
import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = 3000;

// Shopping cart stored in a JavaScript array (no database)
const cart = [
  { id: 1, productName: 'Wireless Mouse', price: 799, quantity: 2 },
  { id: 2, productName: 'Keyboard', price: 1299, quantity: 1 },
  { id: 3, productName: 'USB Cable', price: 199, quantity: 3 },
];

// Helper: send JSON response
const sendJSON = (res, statusCode, data) => {
  res.writeHead(statusCode, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(data, null, 2));
};

// Helper: send HTML response
const sendHTML = (res, statusCode, html) => {
  res.writeHead(statusCode, { 'Content-Type': 'text/html' });
  res.end(html);
};

const server = http.createServer((req, res) => {
  const { method } = req;
  const url = req.url.split('?')[0];

  // GET /  -> Welcome message in HTML
  if (url === '/' && method === 'GET') {
    sendHTML(res, 200, '<h1>Welcome to the Shopping Cart Application</h1><p>Try /cart, /about or /home</p>');

  // GET /cart -> all items in JSON
  } else if (url === '/cart' && method === 'GET') {
    sendJSON(res, 200, cart);

  // GET /about -> application information
  } else if (url === '/about' && method === 'GET') {
    sendHTML(
      res,
      200,
      '<h1>About</h1><p>Shopping Cart Management Application built using the Node.js HTTP and FS modules.</p>'
    );

  // GET /home -> serve public/index.html using FS module
  } else if (url === '/home' && method === 'GET') {
    const filePath = path.join(__dirname, 'public', 'index.html');
    fs.readFile(filePath, (err, content) => {
      if (err) {
        console.error('File read error:', err.message);
        sendHTML(res, 500, '<h1>500 - Internal Server Error</h1><p>Could not read index.html</p>');
        return;
      }
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(content);
    });

  // POST /add-to-cart -> add product from JSON body
  } else if (url === '/add-to-cart' && method === 'POST') {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk.toString();
    });
    req.on('end', () => {
      let product;
      try {
        product = JSON.parse(body);
      } catch {
        return sendJSON(res, 400, { error: 'Invalid JSON format' });
      }

      const { id, productName, price, quantity } = product;

      // Validate required fields
      if (
        id === undefined ||
        !productName ||
        price === undefined ||
        quantity === undefined
      ) {
        return sendJSON(res, 400, {
          error: 'id, productName, price and quantity are required',
        });
      }
      if (typeof price !== 'number' || typeof quantity !== 'number' || price < 0 || quantity <= 0) {
        return sendJSON(res, 400, {
          error: 'price must be a non-negative number and quantity must be a positive number',
        });
      }
      if (cart.some((item) => item.id === id)) {
        return sendJSON(res, 409, { error: `Product with id ${id} already exists` });
      }

      const newItem = { id, productName, price, quantity };
      cart.push(newItem);
      sendJSON(res, 201, { message: 'Product added to cart successfully', product: newItem });
    });
    req.on('error', () => sendJSON(res, 400, { error: 'Invalid request' }));

  // Known route but wrong method
  } else if (['/', '/cart', '/about', '/home', '/add-to-cart'].includes(url)) {
    sendJSON(res, 405, { error: `Method ${method} not allowed on ${url}` });

  // Invalid route -> 404
  } else {
    sendHTML(res, 404, '<h1>404 - Page Not Found</h1>');
  }
});

server.listen(PORT, () => {
  console.log(`HTTP Server running at http://localhost:${PORT}`);
});
