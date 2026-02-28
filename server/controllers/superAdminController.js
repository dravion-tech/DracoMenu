const User = require("../models/User");
const Restaurant = require("../models/Restaurant");

exports.getAllUsers = async (req, res) => {
  try {
    // Get all restaurant owners and their restaurant data
    const users = await User.find({ role: "restaurant_owner" }).select(
      "-password",
    );

    // For each user, find their restaurant
    const usersWithRestaurants = await Promise.all(
      users.map(async (user) => {
        const restaurant = await Restaurant.findOne({ owner: user._id });
        return {
          ...user._doc,
          restaurant: restaurant
            ? {
                name: restaurant.name,
                id: restaurant._id,
              }
            : null,
        };
      }),
    );

    res.json(usersWithRestaurants);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateUserStatus = async (req, res) => {
  try {
    const { userId } = req.params;
    const { status } = req.body;

    if (!["active", "suspended", "pending"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const updates = {
      status,
      isApproved: status === "active",
    };

    const user = await User.findByIdAndUpdate(userId, updates, {
      returnDocument: "after",
    }).select("-password");

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
