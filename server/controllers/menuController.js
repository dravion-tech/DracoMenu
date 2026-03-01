const Category = require("../models/Category");
const MenuItem = require("../models/MenuItem");
const Restaurant = require("../models/Restaurant");
const cloudinary = require("../config/cloudinary");

// Category Controllers
exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.find({
      restaurant: req.user.restaurantId,
    }).sort("orderIndex");
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createCategory = async (req, res) => {
  try {
    const category = new Category({
      ...req.body,
      restaurant: req.user.restaurantId,
    });
    await category.save();
    res.status(201).json(category);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateCategory = async (req, res) => {
  try {
    const category = await Category.findOneAndUpdate(
      { _id: req.params.id, restaurant: req.user.restaurantId },
      req.body,
      { new: true },
    );
    res.json(category);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    await Category.findOneAndDelete({
      _id: req.params.id,
      restaurant: req.user.restaurantId,
    });
    // Also delete items in this category? Usually yes.
    await MenuItem.deleteMany({ category: req.params.id });
    res.json({ message: "Category and its items deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// MenuItem Controllers
exports.getMenuItems = async (req, res) => {
  try {
    const items = await MenuItem.find({
      restaurant: req.user.restaurantId,
    }).populate("category");
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createMenuItem = async (req, res) => {
  try {
    const itemData = { ...req.body };
    if (req.file) {
      // Upload to Cloudinary using stream
      const uploadPromise = new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder: "menu_items" },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          },
        );
        uploadStream.end(req.file.buffer);
      });

      const result = await uploadPromise;
      itemData.image = result.secure_url;
    }
    const item = new MenuItem({
      ...itemData,
      restaurant: req.user.restaurantId,
    });
    await item.save();
    res.status(201).json(item);
  } catch (err) {
    console.error("Upload Error:", err);
    res.status(500).json({ message: err.message });
  }
};

exports.updateMenuItem = async (req, res) => {
  try {
    const itemData = { ...req.body };
    if (req.file) {
      const uploadPromise = new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder: "menu_items" },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          },
        );
        uploadStream.end(req.file.buffer);
      });

      const result = await uploadPromise;
      itemData.image = result.secure_url;
    }
    const item = await MenuItem.findOneAndUpdate(
      { _id: req.params.id, restaurant: req.user.restaurantId },
      itemData,
      { new: true },
    );
    res.json(item);
  } catch (err) {
    console.error("Update Upload Error:", err);
    res.status(500).json({ message: err.message });
  }
};

exports.deleteMenuItem = async (req, res) => {
  try {
    await MenuItem.findOneAndDelete({
      _id: req.params.id,
      restaurant: req.user.restaurantId,
    });
    res.json({ message: "Menu item deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
