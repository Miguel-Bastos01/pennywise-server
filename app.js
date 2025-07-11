const express = require("express");
const { isAuthenticated } = require("./middleware/jwt.middleware");

const app = express();
require("dotenv").config();
require("./db");
require("./config")(app);

const authRoutes = require("./routes/auth.routes");
app.use("/auth", authRoutes); // login/signup

const expenseRoutes = require("./routes/expense.routes");
app.use("/api", isAuthenticated, expenseRoutes); // ✅ protect all expense routes

require("./error-handling")(app);
module.exports = app;


