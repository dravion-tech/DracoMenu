const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config();

const app = express();

// Middleware
const allowedOrigins = [
  process.env.FRONTEND_URL,
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "https://dracomenu.netlify.app",
]
  .filter(Boolean)
  .map((url) => url.replace(/\/$/, ""));

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      const normalizedOrigin = origin.replace(/\/$/, "");
      if (allowedOrigins.includes(normalizedOrigin)) {
        return callback(null, true);
      } else {
        console.log("CORS Blocked for origin:", origin);
        return callback(new Error("Not allowed by CORS"), false);
      }
    },
    credentials: true,
  }),
);
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
app.get("/", (req, res) => res.send("QR Menu Backend is Running 🚀"));
app.use("/api/auth", require("./routes/auth"));
app.use("/api/restaurant", require("./routes/restaurant"));
app.use("/api/menu", require("./routes/menu"));
app.use("/api/orders", require("./routes/orders"));
app.use("/api/public", require("./routes/public"));
app.use("/api/super-admin", require("./routes/superAdmin"));

// Global Error Handler
app.use((err, req, res, next) => {
  console.error("GLOBAL ERROR:", err.stack);
  res.status(500).json({
    message: "Internal Server Error",
    error: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
});

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
if (require.main === module) {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

module.exports = app;
