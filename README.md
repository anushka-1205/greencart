# 🛒 GreenCart

GreenCart is a full-stack e-commerce web application for ordering groceries online. It features a modern React frontend and a Node.js/Express backend, with MongoDB for data storage. The application is built using the MERN stack.

---

## 🧠 Features

- User authentication and profile management
- Product browsing and search
- Shopping cart and order management
- Address management for deliveries
- Secure payment integration
- Responsive design for mobile and desktop

---

## 🛠️ Tech Stack

- **Frontend:** React, Vite, CSS
- **Backend:** Node.js, Express
- **Database:** MongoDB
- **Cloud Storage:** Cloudinary (for images)
- **File Uploads:** Multer

---

## 🗂️ Project Structure

```
greencart/
  client/         # React frontend
    src/
      components/ # Reusable UI components
      context/    # React context providers
      pages/      # Application pages
      assets/     # Static assets
    public/       # Static public files
    index.html
    package.json
    ...
  server/         # Node.js backend
    configs/      # Configuration files (DB, Cloudinary, Multer)
    controllers/  # Route controllers
    middlewares/  # Express middlewares
    models/       # Mongoose models
    routes/       # API routes
    server.js     # Entry point
    package.json
    ...
  README.md
  .gitignore
```
---

## 🚀 Getting Started

### Prerequisites

- Node.js (v16+ recommended)
- npm or yarn
- MongoDB instance (local or cloud)

### Setup

#### 1. Clone the repository

```sh
git clone https://github.com/yourusername/greencart.git
cd greencart
```

#### 2. Setup the Backend

```sh
cd server
cp .env.example .env
# Edit .env with your MongoDB URI and other secrets
npm install
npm start
```

#### 3. Setup the Frontend

```sh
cd ../client
cp .env.example .env  # If applicable
npm install
npm run dev
```

#### 4. Open in Browser

Visit [http://localhost:5173](http://localhost:5173) (or the port shown in your terminal).

---

## 🔐 Environment Variables

- Backend: See `server/.env.example` for required variables.
- Frontend: See `client/.env.example` for frontend environment variables.

---

## 🔧 Scripts

- **Backend**
  - `npm start` — Start the Express server
- **Frontend**
  - `npm run dev` — Start the Vite development server
  - `npm run build` — Build for production
  
---
Author: Anushka Srivastava

