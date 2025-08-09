const express = require("express");
const { authenticateToken } = require("../middleware/auth");
const Category = require("../models/Category");
const router = express.Router();

// Apply authentication middleware to all routes
router.use(authenticateToken);

// Get all categories available to the user (default + custom)
router.get("/", async (req, res) => {
  try {
    const userId = req.user.id;
    const categories = await Category.getAllUserCategories(userId);

    res.status(200).json({
      success: true,
      data: categories,
    });
  } catch (error) {
    console.error("Get categories error:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// Get only default categories
router.get("/default", async (req, res) => {
  try {
    const categories = await Category.getDefaultCategories();

    res.status(200).json({
      success: true,
      data: categories,
    });
  } catch (error) {
    console.error("Get default categories error:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// Get only user's custom categories
router.get("/custom", async (req, res) => {
  try {
    const userId = req.user.id;
    const categories = await Category.getUserCategories(userId);

    res.status(200).json({
      success: true,
      data: categories,
    });
  } catch (error) {
    console.error("Get user categories error:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// Create a new custom category
router.post("/custom", async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, icon, color } = req.body;

    // Validation
    if (!name) {
      return res.status(400).json({
        success: false,
        error: "Category name is required",
      });
    }

    // Check if category name already exists for this user
    const exists = await Category.categoryExists(name, userId);
    if (exists) {
      return res.status(400).json({
        success: false,
        error: "Category with this name already exists",
      });
    }

    const categoryData = {
      name: name.trim(),
      icon: icon || "📝",
      color: color || "#85C1E9",
    };

    const category = await Category.createUserCategory(userId, categoryData);

    res.status(201).json({
      success: true,
      message: "Custom category created successfully",
      data: category,
    });
  } catch (error) {
    console.error("Create custom category error:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// Update a custom category
router.put("/custom/:id", async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const { name, icon, color } = req.body;

    // Check if another category with the same name exists (excluding current one)
    if (name) {
      const exists = await Category.categoryExists(name, userId);
      if (exists) {
        // Need to check if it's not the current category being updated
        const userCategories = await Category.getUserCategories(userId);
        const existingCategory = userCategories.find(
          (cat) => cat.name === name && cat.id !== id
        );

        if (existingCategory) {
          return res.status(400).json({
            success: false,
            error: "Category with this name already exists",
          });
        }
      }
    }

    const updateData = {};
    if (name !== undefined) updateData.name = name.trim();
    if (icon !== undefined) updateData.icon = icon;
    if (color !== undefined) updateData.color = color;

    const category = await Category.updateUserCategory(id, userId, updateData);

    res.status(200).json({
      success: true,
      message: "Custom category updated successfully",
      data: category,
    });
  } catch (error) {
    console.error("Update custom category error:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// Delete a custom category
router.delete("/custom/:id", async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    await Category.deleteUserCategory(id, userId);

    res.status(200).json({
      success: true,
      message: "Custom category deleted successfully",
    });
  } catch (error) {
    console.error("Delete custom category error:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

module.exports = router;
