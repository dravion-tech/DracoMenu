const Order = require("../models/Order");

exports.placeOrder = async (req, res) => {
  try {
    const { restaurantId, items, customerName, customerPhone, tableNumber } =
      req.body;

    let totalAmount = 0;
    items.forEach((item) => {
      totalAmount += item.price * item.quantity;
    });

    const order = new Order({
      restaurant: restaurantId,
      items,
      totalAmount,
      customerName,
      customerPhone,
      tableNumber,
    });

    await order.save();
    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getRestaurantOrders = async (req, res) => {
  try {
    const orders = await Order.find({ restaurant: req.user.restaurantId }).sort(
      "-orderDate",
    );
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findOneAndUpdate(
      { _id: req.params.id, restaurant: req.user.restaurantId },
      { status: req.body.status },
      { new: true },
    );
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
