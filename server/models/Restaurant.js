const mongoose = require("mongoose");

const restaurantSchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  name: { type: String, required: true },
  logo: { type: String },
  theme: {
    type: String,
    enum: ["modern", "dark", "minimal"],
    default: "modern",
  },
  primaryColor: { type: String, default: "#3b82f6" },
  fontFamily: { type: String, default: "Inter" },
  address: { type: String },
  phone: { type: String },
  qrCode: { type: String },
  tableCount: { type: Number, default: 0 },
  staffPIN: { type: String, default: "1234" },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Restaurant", restaurantSchema);
