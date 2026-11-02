# MT1-LABEXAM - Shopping Cart Management Web Application

Full Stack Development - Node.js Lab Examination
Technology: Node.js, HTTP module, FS module, Express.js | Database: none (JavaScript array)

## Project Structure
```
MT1-LABEXAM/
├── README.md
└── ShoppingCart/
    ├── package.json
    ├── httpServer.js      (Part A - HTTP + FS modules, port 3000)
    ├── expressApp.js      (Part B - Express REST API, port 4000)
    ├── public/
    │   └── index.html
    └── screenshots/
```

## 1. Setup (do this first)
Requirements: Node.js 18+ and Git.
```bash
cd MT1-LABEXAM/ShoppingCart
npm install
```
`package.json` already has `"type": "module"` (ES Modules) and Express as a dependency.

## 2. GitHub Instructions (start of exam)
1. Create an empty repository named **MT1-LABEXAM** on GitHub.
2. From the `MT1-LABEXAM` folder:
```bash
git init
git add ShoppingCart/package.json ShoppingCart/package-lock.json ShoppingCart/.gitignore
git commit -m "Initial project setup with package.json"
git branch -M main
git remote add origin https://github.com/<your-username>/MT1-LABEXAM.git
git push -u origin main
```
(Run `npm install` inside `ShoppingCart` first so `package-lock.json` exists. The initial commit adds only the setup files, so each module gets its own commit afterwards.)
3. Commit and push after each module:
```bash
git add ShoppingCart/httpServer.js ShoppingCart/public
git commit -m "Add HTTP server with routing and FS static file serving"
git push

git add ShoppingCart/expressApp.js
git commit -m "Add Express REST API with CRUD operations"
git push

git add ShoppingCart/screenshots README.md
git commit -m "Add screenshots and README"
git push
```
(Tip: if you are typing the code yourself in the exam, commit after each small piece for a richer history.)

## 3. Run Part A - HTTP Server (port 3000)
```bash
node httpServer.js
```
Expected output: `HTTP Server running at http://localhost:3000`

| URL | Expected result |
|---|---|
| http://localhost:3000/ | Welcome message (HTML) |
| http://localhost:3000/cart | Cart items (JSON) |
| http://localhost:3000/about | Application info |
| http://localhost:3000/home | index.html served using the FS module |
| http://localhost:3000/xyz | 404 Page Not Found |

POST test (Postman): `POST http://localhost:3000/add-to-cart`, Body -> raw -> JSON
```json
{ "id": 4, "productName": "Bluetooth Headphones", "price": 1499, "quantity": 1 }
```
Expected: 201 + success message. Missing fields -> 400, duplicate id -> 409, invalid JSON -> 400.

## 4. Run Part B - Express API (port 4000)
Open a second terminal:
```bash
node expressApp.js
```
Expected output: `Express Server running at http://localhost:4000`

| Method | URL | Expected result |
|---|---|---|
| GET | http://localhost:4000/cart | All items (with totalPrice) |
| GET | http://localhost:4000/cart/1 | Item with ID 1 |
| POST | http://localhost:4000/cart | 201 - "Product added successfully" |
| PUT | http://localhost:4000/cart/1 | Product updated |
| DELETE | http://localhost:4000/cart/1 | Product removed |
| GET | http://localhost:4000/cart/99 | 404 - product not found |

POST body:
```json
{ "id": 4, "productName": "Bluetooth Headphones", "price": 1499, "quantity": 1, "category": "Electronics" }
```
PUT body (`/cart/1`):
```json
{ "productName": "Wireless Mouse", "price": 899, "quantity": 3, "category": "Electronics" }
```

## 5. Screenshots to take (save in `ShoppingCart/screenshots/`)
1. Terminal: `node httpServer.js` running successfully.
2. Browser: `/`, `/cart`, `/about` on port 3000.
3. Browser: `/home` (static file served by FS module).
4. Terminal: `node expressApp.js` running successfully.
5. Postman: GET all, GET by id, POST, PUT, DELETE (each with response and status code).
6. Postman: one 404 case and one validation error (400).
7. GitHub: repository page and commit history.

## 6. Demo Guideline for the Examiner
1. Show the folder structure and `package.json` (`"type": "module"`, express installed).
2. Run `node httpServer.js` in terminal 1; open all 4 URLs plus an invalid URL (404).
3. Explain: `http.createServer()`, routing with `req.url` and `req.method`, `fs.readFile` for `/home`, `Content-Type` headers, JSON body parsing from the request stream, validation.
4. Run `node expressApp.js` in terminal 2 (both servers run independently).
5. In Postman run GET -> GET by id -> POST (201) -> PUT -> DELETE -> GET again to show the array was updated; then show a 404.
6. Explain: `express.json()` middleware, route parameters (`req.params.id`), status codes (201, 400, 404, 409), `totalPrice = price x quantity`.
7. Show the GitHub repo with meaningful commit messages.

## 7. Submission Checklist
- [ ] Repository named MT1-LABEXAM pushed with commit history
- [ ] package.json
- [ ] Screenshots: HTTP server running
- [ ] Screenshots: static file serving (FS module)
- [ ] Screenshots: Postman GET, POST, PUT, DELETE
- [ ] Screenshots: GitHub commit history
- [ ] Organized project folder

## Common Issues
- `Cannot use import statement outside a module` -> check `"type": "module"` in package.json.
- `Cannot find package 'express'` -> run `npm install` inside `ShoppingCart`.
- `EADDRINUSE` -> the port is busy; stop the old process (Ctrl+C) and rerun.
- Postman returns 400 -> set Body to raw + JSON and make sure the JSON is valid.
