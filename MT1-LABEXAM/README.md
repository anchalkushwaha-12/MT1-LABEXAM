# MT1-LABEXAM — Shopping Cart Management

## Requirements

* Node.js (LTS recommended)
* npm
* Postman (for Express API testing)

## Setup

```bash
npm install
```

## Run Part A (Built-in HTTP + FS Modules)

```bash
node httpServer.js
```

Open in browser:

* http://localhost:3000/
* http://localhost:3000/cart
* http://localhost:3000/about
* http://localhost:3000/home

### Test POST `/add-to-cart` in Postman

URL: `http://localhost:3000/add-to-cart`

Select **Body → raw → JSON**:

```json
{
  "id": 4,
  "productName": "Bluetooth Headphones",
  "price": 1499,
  "quantity": 1
}
```

## Run Part B (Express REST API)

Open a second terminal:

```bash
node expressApp.js
```

Base URL: `http://localhost:4000`

| Method | Endpoint  | Purpose               |
| ------ | --------- | --------------------- |
| GET    | `/cart`   | Get all products      |
| GET    | `/cart/1` | Get product with ID 1 |
| POST   | `/cart`   | Add a product         |
| PUT    | `/cart/1` | Update product 1      |
| DELETE | `/cart/1` | Delete product 1      |

For POST and PUT, choose **Body → raw → JSON** in Postman.

## GitHub Suggested Commits

```bash
git init
git add .
git commit -m "Initial project setup"

git add httpServer.js public/index.html
git commit -m "Implement HTTP server and static home page"

git add expressApp.js
git commit -m "Implement shopping cart CRUD REST API"

git add README.md screenshots/
git commit -m "Add documentation and practical screenshots"
```

---

**Submitted By: Amarjeet Kushwaha**
*RollNo: 2500320100166*
