const Restaurant = require("../models/Restaurant");
const Category = require("../models/Category");
const MenuItem = require("../models/MenuItem");
const Order = require("../models/Order");

exports.getPublicMenu = async (req, res) => {
  try {
    const { restaurantId } = req.params;

    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant)
      return res.status(404).json({ message: "Restaurant not found" });

    const categories = await Category.find({ restaurant: restaurantId }).sort(
      "orderIndex",
    );
    const items = await MenuItem.find({
      restaurant: restaurantId,
      isAvailable: true,
    }).populate("category");

    res.json({
      restaurant,
      categories,
      items,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getStaffOrders = async (req, res) => {
  try {
    const { restaurantId } = req.params;
    const { status } = req.query;

    let query = { restaurant: restaurantId };

    if (status) {
      query.status = status;
    } else {
      // Default to active orders
      query.status = { $in: ["pending", "preparing"] };
    }

    const orders = await Order.find(query).sort("-orderDate").limit(50); // Limit results for performance

    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateStaffOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    const order = await Order.findByIdAndUpdate(
      orderId,
      { status },
      { new: true },
    );
    if (!order) return res.status(404).json({ message: "Order not found" });

    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
