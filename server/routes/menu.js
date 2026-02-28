const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const upload = require("../middleware/upload");
const {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  getMenuItems,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
} = require("../controllers/menuController");

// Categories
router.get("/categories", auth, getCategories);
router.post("/categories", auth, createCategory);
router.put("/categories/:id", auth, updateCategory);
router.delete("/categories/:id", auth, deleteCategory);

// Menu Items
router.get("/items", auth, getMenuItems);
router.post("/items", auth, upload.single("image"), createMenuItem);
router.put("/items/:id", auth, upload.single("image"), updateMenuItem);
router.delete("/items/:id", auth, deleteMenuItem);

module.exports = router;
