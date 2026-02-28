const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const {
  placeOrder,
  getRestaurantOrders,
  updateOrderStatus,
} = require("../controllers/orderController");

router.post("/public/place", placeOrder); // Public route for customers
router.get("/", auth, getRestaurantOrders);
router.put("/:id/status", auth, updateOrderStatus);

module.exports = router;
