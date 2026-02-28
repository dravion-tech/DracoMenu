const mongoose = require("mongoose");
const User = require("./models/User");
require("dotenv").config();

const emailToPromote = process.argv[2];

if (!emailToPromote) {
  console.log("Usage: node bootstrap-admin.js <email>");
  process.exit(1);
}

const dbUri = process.env.MONGODB_URI || "mongodb://localhost:27017/qr-menu";

mongoose
  .connect(dbUri)
  .then(async () => {
    console.log("Connected to MongoDB...");
    const user = await User.findOneAndUpdate(
      { email: emailToPromote },
      {
        role: "super_admin",
        status: "active",
        isApproved: true,
      },
      { new: true },
    );

    if (user) {
      console.log(`SUCCESS: User ${emailToPromote} is now a Super Admin!`);
    } else {
      console.log(`ERROR: User with email ${emailToPromote} not found.`);
    }
    process.exit(0);
  })
  .catch((err) => {
    console.error("Connection error:", err);
    process.exit(1);
  });
