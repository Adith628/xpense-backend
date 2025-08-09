const express = require("express");
const { authenticateToken } = require("../middleware/auth");
const Transaction = require("../models/Transaction");
const Category = require("../models/Category");
const router = express.Router();

// Apply authentication middleware to all routes
router.use(authenticateToken);

// Get all transactions for the authenticated user
router.get("/", async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      category,
      transaction_type,
      start_date,
      end_date,
      limit = 50,
      offset = 0,
    } = req.query;

    const filters = {
      category,
      transaction_type,
      start_date,
      end_date,
      limit: parseInt(limit),
      offset: parseInt(offset),
    };

    // Remove undefined filters
    Object.keys(filters).forEach((key) => {
      if (filters[key] === undefined || filters[key] === "") {
        delete filters[key];
      }
    });

    const transactions = await Transaction.findByUserId(userId, filters);

    res.status(200).json({
      success: true,
      data: transactions,
      pagination: {
        limit: filters.limit || 50,
        offset: filters.offset || 0,
        total: transactions.length,
      },
    });
  } catch (error) {
    console.error("Get transactions error:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// Get a specific transaction
router.get("/:id", async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const transaction = await Transaction.findById(id, userId);

    if (!transaction) {
      return res.status(404).json({
        success: false,
        error: "Transaction not found",
      });
    }

    res.status(200).json({
      success: true,
      data: transaction,
    });
  } catch (error) {
    console.error("Get transaction error:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// Create a new transaction
router.post("/", async (req, res) => {
  try {
    const userId = req.user.id;
    const { title, description, amount, category, transaction_type, date } =
      req.body;

    // Validation
    if (!title || !amount || !category) {
      return res.status(400).json({
        success: false,
        error: "Title, amount, and category are required",
      });
    }

    if (amount <= 0) {
      return res.status(400).json({
        success: false,
        error: "Amount must be greater than 0",
      });
    }

    if (transaction_type && !["income", "expense"].includes(transaction_type)) {
      return res.status(400).json({
        success: false,
        error: 'Transaction type must be either "income" or "expense"',
      });
    }

    // Check if category exists
    const categoryExists = await Category.categoryExists(category, userId);
    if (!categoryExists) {
      return res.status(400).json({
        success: false,
        error:
          "Invalid category. Use existing category or create a custom one first.",
      });
    }

    const transactionData = {
      title,
      description,
      amount: parseFloat(amount),
      category,
      transaction_type: transaction_type || "expense",
      date,
    };

    const transaction = await Transaction.create(userId, transactionData);

    res.status(201).json({
      success: true,
      message: "Transaction created successfully",
      data: transaction,
    });
  } catch (error) {
    console.error("Create transaction error:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// Update a transaction
router.put("/:id", async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const { title, description, amount, category, transaction_type, date } =
      req.body;

    // Check if transaction exists
    const existingTransaction = await Transaction.findById(id, userId);
    if (!existingTransaction) {
      return res.status(404).json({
        success: false,
        error: "Transaction not found",
      });
    }

    // Validation
    if (amount !== undefined && amount <= 0) {
      return res.status(400).json({
        success: false,
        error: "Amount must be greater than 0",
      });
    }

    if (transaction_type && !["income", "expense"].includes(transaction_type)) {
      return res.status(400).json({
        success: false,
        error: 'Transaction type must be either "income" or "expense"',
      });
    }

    // Check if category exists (if being updated)
    if (category) {
      const categoryExists = await Category.categoryExists(category, userId);
      if (!categoryExists) {
        return res.status(400).json({
          success: false,
          error:
            "Invalid category. Use existing category or create a custom one first.",
        });
      }
    }

    const updateData = {};
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (amount !== undefined) updateData.amount = parseFloat(amount);
    if (category !== undefined) updateData.category = category;
    if (transaction_type !== undefined)
      updateData.transaction_type = transaction_type;
    if (date !== undefined) updateData.date = date;

    const transaction = await Transaction.update(id, userId, updateData);

    res.status(200).json({
      success: true,
      message: "Transaction updated successfully",
      data: transaction,
    });
  } catch (error) {
    console.error("Update transaction error:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// Delete a transaction
router.delete("/:id", async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    // Check if transaction exists
    const existingTransaction = await Transaction.findById(id, userId);
    if (!existingTransaction) {
      return res.status(404).json({
        success: false,
        error: "Transaction not found",
      });
    }

    await Transaction.delete(id, userId);

    res.status(200).json({
      success: true,
      message: "Transaction deleted successfully",
    });
  } catch (error) {
    console.error("Delete transaction error:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// Get transaction statistics
router.get("/stats/summary", async (req, res) => {
  try {
    const userId = req.user.id;
    const { start_date, end_date } = req.query;

    const filters = {};
    if (start_date) filters.start_date = start_date;
    if (end_date) filters.end_date = end_date;

    const stats = await Transaction.getStats(userId, filters);

    res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (error) {
    console.error("Get transaction stats error:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// Get category-wise statistics
router.get("/stats/categories", async (req, res) => {
  try {
    const userId = req.user.id;
    const { start_date, end_date, transaction_type } = req.query;

    const filters = {};
    if (start_date) filters.start_date = start_date;
    if (end_date) filters.end_date = end_date;
    if (transaction_type) filters.transaction_type = transaction_type;

    const categoryStats = await Transaction.getCategoryStats(userId, filters);

    res.status(200).json({
      success: true,
      data: categoryStats,
    });
  } catch (error) {
    console.error("Get category stats error:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

module.exports = router;
