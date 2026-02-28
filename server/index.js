const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/restaurant", require("./routes/restaurant"));
app.use("/api/menu", require("./routes/menu"));
app.use("/api/orders", require("./routes/orders"));
app.use("/api/public", require("./routes/public"));
app.use("/api/super-admin", require("./routes/superAdmin"));

// Database Connection
const dbUri = process.env.MONGODB_URI || "mongodb://localhost:27017/qr-menu";
console.log("Connecting to DB:", dbUri.split("@")[1] || dbUri); // Log host only for safety

mongoose
  .connect(dbUri, {
    serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
  })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log("MongoDB Connection Error:", err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
