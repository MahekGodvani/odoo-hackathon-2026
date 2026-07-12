# AssertFlow

AssertFlow is a comprehensive, full-stack asset management system designed to register, track, transfer, and maintain organizational assets efficiently. It features interactive dashboard analytics, QR tracking, maintenance logs, automated reporting, and an AI-powered assistant.

---

## 🚀 Core Features

- **Asset Lifecycle Management**: Register, catalog, categorise, and track physical and digital assets.
- **QR Code Tracking**: Generate and print QR codes for assets to scan and track easily.
- **Resource Booking & Assignments**: Assign assets to users, departments, or specific tasks with check-in/check-out flows.
- **Transfer Management**: Request and authorise asset transfers between physical locations or departments.
- **Maintenance & Repairs**: Log maintenance schedules, request repairs, and view complete service histories.
- **AI Assistant**: Natural language queries to interact with the database, ask questions about asset usage, and check maintenance schedules.
- **Automated Reporting**: Export comprehensive reports in PDF and Excel formats.
- **Role-Based Security**: Role-based access control (RBAC) with security middlewares (Helmet, Express Rate Limit).
- **Swagger API Docs**: Built-in API documentation for seamless integration.

---

## 🛠️ Tech Stack

### Backend
- **Core**: Node.js, Express.js
- **ORM & Database**: Sequelize, MySQL
- **Authentication & Security**: JSON Web Tokens (JWT), BCrypt, Helmet, Express Rate Limit
- **Reporting & Utilities**: ExcelJS, PDFKit, QRCode, Node-Cron
- **Documentation**: Swagger UI (`swagger-ui-express`, `swagger-jsdoc`)

### Frontend
- **Core**: React 19, TypeScript, Vite
- **State Management**: Redux Toolkit, React Redux
- **Routing**: React Router DOM (v7)
- **Styling**: Modern, responsive CSS

---

## 📂 Project Structure

```text
assetflow-backend/
├── config/             # DB connection, Swagger options
├── controllers/        # Express controllers (Asset, User, AI, Transfer, etc.)
├── fronted/            # React 19 Frontend application (Vite + TypeScript)
│   ├── src/
│   │   ├── components/ # Dashboard modules, Layout, Sidebar, UI components
│   │   ├── icons/      # SVGs index file
│   │   ├── pages/      # Pages (Assets, Booking, Maintenance, AI Assistant, etc.)
│   │   └── store/      # Redux slices and setup
├── middleware/         # Auth verification, rate limiting, and mock routers
├── models/             # Sequelize database models (Asset, Assignment, etc.)
├── routes/             # Express API routes
├── seeders/            # Database seed templates (runs automatically)
├── app.js              # Express app initialization
└── server.js           # Server startup script
```

---

## ⚙️ Setup and Installation

### 1. Prerequisites
- **Node.js** (v18+ recommended)
- **MySQL Server** running locally or remotely

### 2. Backend Setup
1. Navigate to the root directory `assetflow-backend/`.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the root directory and configure the environment variables:
   ```env
   PORT=5000
   DB_HOST=localhost
   DB_USER=root
   DB_PASS=your_password
   DB_NAME=assertflow
   JWT_SECRET=your_jwt_secret_key
   ```
4. Start the backend server (the server automatically creates the database and runs database seeding on the first run):
   ```bash
   npm run dev
   ```

### 3. Frontend Setup
1. Navigate to the frontend directory `fronted/`:
   ```bash
   cd fronted
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```

---

## 📖 API Documentation

The backend API is documented via **Swagger**. Once the server is running, visit:
👉 **[http://localhost:5000/api-docs](http://localhost:5000/api-docs)**
