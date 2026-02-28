const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const upload = require("../middleware/upload");
const {
  getProfile,
  updateProfile,
  generateQRCode,
  uploadLogo,
  getDashboardStats,
} = require("../controllers/restaurantController");

router.get("/profile", auth, getProfile);
router.get("/stats", auth, getDashboardStats);
router.put("/profile", auth, updateProfile);
router.post("/qr", auth, generateQRCode);
router.post("/logo/upload", auth, upload.single("logo"), uploadLogo);

module.exports = router;
