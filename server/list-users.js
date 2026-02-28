const mongoose = require("mongoose");
const User = require("./models/User");
require("dotenv").config();

const dbUri = process.env.MONGODB_URI || "mongodb://localhost:27017/qr-menu";

mongoose
  .connect(dbUri)
  .then(async () => {
    const users = await User.find({}, "email name role status");
    console.log(JSON.stringify(users, null, 2));
    process.exit(0);
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
