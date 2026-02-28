const User = require("../models/User");
const Restaurant = require("../models/Restaurant");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
  if (process.env.SIGNUP_ENABLED === "false") {
    return res.status(403).json({
      message: "Public signup is currently disabled. Please contact support.",
    });
  }
  try {
    const { name, email, password, restaurantName } = req.body;

    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: "User already exists" });

    user = new User({
      name,
      email,
      password,
      status: "pending",
      isApproved: false,
    });
    await user.save();

    // Create a default restaurant for the owner
    const restaurant = new Restaurant({
      owner: user._id,
      name: restaurantName || `${name}'s Restaurant`,
    });
    await restaurant.save();

    const token = jwt.sign(
      { id: user._id, role: user.role, restaurantId: restaurant._id },
      process.env.JWT_SECRET || "secret",
      { expiresIn: "7d" },
    );

    res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
      },
      restaurantId: restaurant._id,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await user.comparePassword(password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    if (user.role !== "super_admin" && user.status !== "active") {
      const statusMsgs = {
        pending: "Your account is waiting for approval by an administrator.",
        suspended: "Your account has been suspended. Please contact support.",
      };
      return res.status(403).json({
        message: statusMsgs[user.status] || "Access denied",
      });
    }

    const restaurant = await Restaurant.findOne({ owner: user._id });

    const token = jwt.sign(
      { id: user._id, role: user.role, restaurantId: restaurant?._id },
      process.env.JWT_SECRET || "secret",
      { expiresIn: "7d" },
    );

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
      },
      restaurantId: restaurant?._id,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
