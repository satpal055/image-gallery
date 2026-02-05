require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

// Routes
const adminAuthRoutes = require("./routes/adminAuth");
const imageRoutes = require("./routes/images");
const userRoutes = require("./routes/userRoutes");

const app = express();

/* ---------------- MIDDLEWARE ---------------- */
app.use(cors());
app.use(express.json());

/* ---------------- DB ---------------- */
connectDB();

/* ---------------- ROUTES ---------------- */
app.get("/", (req, res) => {
  res.send("API running...");
});

app.use("/api/admin", adminAuthRoutes);
app.use("/api/images", imageRoutes);
app.use("/api/users", userRoutes);

/* ---------------- SERVER ---------------- */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
