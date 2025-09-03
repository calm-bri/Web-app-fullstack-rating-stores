# 🏬 Store Rating Management System

![Build](https://img.shields.io/badge/build-passing-brightgreen.svg)
![React](https://img.shields.io/badge/Frontend-React-blue)
![Express.js](https://img.shields.io/badge/Backend-Express.js-green)
![PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL-blue)

A **role-based store rating and management system** where users can browse and rate stores, owners can manage their own stores, and admins can manage everything (users, stores, and ratings).

This project is built with a **React.js frontend** and an **Express.js + PostgreSQL backend** using **Sequelize ORM**. It features **role-based dashboards**, **JWT authentication**, and a clean modern **Apple-style glassmorphism UI**.

---

## 🚀 Features

### 🔐 Authentication & Roles

- Secure **JWT-based authentication** (Signup/Login)
- **Role-based access control**:
  - **User** → Browse all stores, add/edit/delete their own ratings
  - **Owner** → CRUD operations on their own stores, view ratings given by users
  - **Admin** → Manage all users, stores, and ratings with full access

### 📊 Dashboards

- **User Dashboard**
  - View all stores and submit/update ratings using a slider + comments
  - See rated & unrated stores
  - Analytics: Total stores, your ratings, and average rating given
- **Owner Dashboard**
  - Manage your stores (add/edit/delete)
  - View user ratings and comments on your stores
  - Analytics: Number of stores owned, total ratings received, average rating
- **Admin Dashboard**
  - Manage all stores, users, and ratings
  - Analytics: Total users, total stores, total ratings, average ratings
  - Create stores on behalf of owners

### 🎨 UI/UX

- Responsive **Apple-like glassmorphism design** with gradients
- Intuitive dashboards for different roles
- Modal forms for adding stores and submitting ratings
- Simple and clean interface with modern visuals

---

## 🛠️ Tech Stack

### Frontend

- ⚛️ **React.js** (Hooks, Context API for auth)
- 🌐 **Axios** for API requests
- 🎨 **Global CSS** with glassmorphism & modern UI design

### Backend

- 🟢 **Express.js**
- 🛢️ **PostgreSQL** with **Sequelize ORM**
- 🔐 **JWT Authentication & Middleware**
- 🛡️ Role-based access control (Admin, Owner, User)

---

## 📂 Project Structure

```
store-rating-app/        # Backend
 ┣ src/
 ┃ ┣ config/             # Database config
 ┃ ┣ controllers/        # Business logic (auth, stores, ratings, dashboards)
 ┃ ┣ middlewares/        # Authentication & role checking
 ┃ ┣ models/             # Sequelize models
 ┃ ┣ routes/             # API endpoints
 ┃ ┗ server.js           # Backend entry point

store-rating-frontend/   # Frontend
 ┣ src/
 ┃ ┣ api/                # Axios setup
 ┃ ┣ components/         # Reusable UI (StoreCard, RatingModal, Navbar, etc.)
 ┃ ┣ context/            # AuthContext for global state
 ┃ ┣ pages/              # Dashboards (Admin, Owner, User) + Auth pages
 ┃ ┣ styles/             # Global CSS
 ┃ ┗ App.js              # Main frontend entry
```

---

## ⚡ Setup Instructions

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/store-rating-app.git
   ```

2. **Install dependencies:**
   ```bash
   cd store-rating-app && npm install
   cd ../store-rating-frontend && npm install
   ```

3. **Configure environment variables (`.env` in backend):**
   ```
   PORT=5000
   DB_USER=your_postgres_user
   DB_PASSWORD=your_postgres_password
   DB_NAME=store_rating
   DB_HOST=localhost
   JWT_SECRET=your_secret_key
   ```

4. **Start backend:**
   ```bash
   cd store-rating-app
   npm start
   ```

5. **Start frontend:**
   ```bash
   cd store-rating-frontend
   npm start
   ```

6. **Access:**
   - **Frontend** → [http://localhost:3000](http://localhost:3000)
   - **Backend API** → [http://localhost:5000/api](http://localhost:5000/api)

---

## 🔮 Future Enhancements

- Add pagination & advanced filtering for stores/ratings
- Upload images for stores
- Deploy with Docker + CI/CD pipeline
- Add email notifications for rating/store updates

---

## 🤝 Contributing

Contributions are welcome! Please open issues or submit pull requests for improvements or bug fixes.

---

✨ With this app, users get a smooth and modern experience while admins and owners get full control over store ratings and management.
