const express = require("express");
const { authenticateToken } = require("../middleware/auth");
const router = express.Router();

// Apply authentication middleware to all routes in this router
router.use(authenticateToken);

// Get user profile
router.get("/profile", async (req, res) => {
  try {
    res.status(200).json({
      message: "Profile retrieved successfully",
      user: {
        id: req.user.id,
        email: req.user.email,
        fullName: req.user.user_metadata?.full_name,
        createdAt: req.user.created_at,
        lastSignIn: req.user.last_sign_in_at,
      },
    });
  } catch (error) {
    console.error("Profile error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Update user profile
router.put("/profile", async (req, res) => {
  try {
    const { fullName } = req.body;
    const { supabase } = require("../config/supabase");

    // Get user token from request headers
    const authHeader = req.headers["authorization"];
    const token = authHeader.split(" ")[1];

    // Update user metadata
    const { data, error } = await supabase.auth.updateUser({
      data: { full_name: fullName },
    });

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.status(200).json({
      message: "Profile updated successfully",
      user: {
        id: data.user.id,
        email: data.user.email,
        fullName: data.user.user_metadata?.full_name,
      },
    });
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Protected test endpoint
router.get("/test", (req, res) => {
  res.status(200).json({
    message: "This is a protected route",
    userId: req.user.id,
    userEmail: req.user.email,
    timestamp: new Date().toISOString(),
  });
});

module.exports = router;
