const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const superAdminController = require("../controllers/superAdminController");

// Helper middleware for super_admin check
const isSuperAdmin = (req, res, next) => {
  if (req.user && req.user.role === "super_admin") {
    next();
  } else {
    res.status(403).json({ message: "Access denied. Super Admin only." });
  }
};

router.get("/users", auth, isSuperAdmin, superAdminController.getAllUsers);
router.put(
  "/users/:userId/status",
  auth,
  isSuperAdmin,
  superAdminController.updateUserStatus,
);

module.exports = router;
