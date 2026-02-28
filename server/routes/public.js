const express = require("express");
const router = express.Router();
const {
  getPublicMenu,
  getStaffOrders,
  updateStaffOrderStatus,
} = require("../controllers/publicController");

router.get("/:restaurantId", getPublicMenu);
router.get("/staff/orders/:restaurantId", getStaffOrders);
router.put("/staff/orders/:orderId/status", updateStaffOrderStatus);

module.exports = router;
