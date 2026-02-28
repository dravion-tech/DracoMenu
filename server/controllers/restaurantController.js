const Restaurant = require("../models/Restaurant");
const Order = require("../models/Order");
const MenuItem = require("../models/MenuItem");
const QRCode = require("qrcode");

exports.getProfile = async (req, res) => {
  try {
    const restaurant = await Restaurant.findOne({ owner: req.user.id });
    res.json(restaurant);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const restaurant = await Restaurant.findOneAndUpdate(
      { owner: req.user.id },
      req.body,
      { returnDocument: "after" },
    );
    res.json(restaurant);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.generateQRCode = async (req, res) => {
  try {
    const restaurant = await Restaurant.findOne({ owner: req.user.id });
    if (!restaurant)
      return res.status(404).json({ message: "Restaurant not found" });

    const menuUrl = `${req.body.baseUrl}/menu/${restaurant._id}`;
    const qrCodeImage = await QRCode.toDataURL(menuUrl);

    restaurant.qrCode = qrCodeImage;
    await restaurant.save();

    res.json({ qrCode: qrCodeImage });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
exports.uploadLogo = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const host = req.get("host");
    const protocol = req.protocol;
    const backendUrl = process.env.BACKEND_URL || `${protocol}://${host}`;

    const restaurant = await Restaurant.findOneAndUpdate(
      { owner: req.user.id },
      { logo: `${backendUrl}/uploads/${req.file.filename}` },
      { returnDocument: "after" },
    );

    res.json(restaurant);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getDashboardStats = async (req, res) => {
  try {
    const restaurant = await Restaurant.findOne({ owner: req.user.id });
    if (!restaurant)
      return res.status(404).json({ message: "Restaurant not found" });

    const restaurantId = restaurant._id;

    // 1. Total Sales (completed orders)
    const salesData = await Order.aggregate([
      { $match: { restaurant: restaurantId, status: "completed" } },
      { $group: { _id: null, totalSales: { $sum: "$totalAmount" } } },
    ]);
    const totalSales = salesData.length > 0 ? salesData[0].totalSales : 0;

    // 2. Active Orders (pending or preparing)
    const activeOrders = await Order.countDocuments({
      restaurant: restaurantId,
      status: { $in: ["pending", "preparing"] },
    });

    // 3. Menu Items
    const totalItems = await MenuItem.countDocuments({
      restaurant: restaurantId,
    });

    // 4. Recent Activity (last 5 orders)
    const recentOrders = await Order.find({ restaurant: restaurantId })
      .sort({ orderDate: -1 })
      .limit(5);

    res.json({
      totalSales,
      activeOrders,
      totalItems,
      recentOrders,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
