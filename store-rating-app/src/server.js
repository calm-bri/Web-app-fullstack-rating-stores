const express = require("express");
const cors = require("cors");
require("dotenv").config();

const ratingRoutes = require("./routes/ratingRoutes");
const sequelize = require("./config/database");
const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");
const storeRoutes = require("./routes/storeRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const { User, Store, Rating } = require('./models/index');
const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/ratings", ratingRoutes); //rating routes
app.use("/api/stores" , storeRoutes) // store routes
app.use("/api/admin", adminRoutes); // admin routes
app.use("/api/auth", authRoutes); // auth routes
app.use("/api/dashboard", dashboardRoutes); // dashboard routes
app.get("/", (req, res) => res.send("API is running..."));

// sync db
 sequelize.sync({ alter: true }).then(() => {
   console.log("Database synced");
   app.listen(process.env.PORT, () =>
     console.log(`Server running on port ${process.env.PORT}`)
   );
 });
