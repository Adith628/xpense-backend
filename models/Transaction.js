const { supabase } = require("../config/supabase");

class Transaction {
  constructor(data) {
    this.id = data.id;
    this.user_id = data.user_id;
    this.title = data.title;
    this.description = data.description;
    this.amount = data.amount;
    this.category = data.category;
    this.transaction_type = data.transaction_type;
    this.date = data.date;
    this.created_at = data.created_at;
    this.updated_at = data.updated_at;
  }

  // Create a new transaction
  static async create(userId, transactionData) {
    const { data, error } = await supabase
      .from("transactions")
      .insert({
        user_id: userId,
        title: transactionData.title,
        description: transactionData.description,
        amount: transactionData.amount,
        category: transactionData.category,
        transaction_type: transactionData.transaction_type || "expense",
        date: transactionData.date || new Date().toISOString().split("T")[0],
      })
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return new Transaction(data);
  }

  // Get all transactions for a user
  static async findByUserId(userId, filters = {}) {
    let query = supabase
      .from("transactions")
      .select("*")
      .eq("user_id", userId)
      .order("date", { ascending: false });

    // Apply filters
    if (filters.category) {
      query = query.eq("category", filters.category);
    }

    if (filters.transaction_type) {
      query = query.eq("transaction_type", filters.transaction_type);
    }

    if (filters.start_date) {
      query = query.gte("date", filters.start_date);
    }

    if (filters.end_date) {
      query = query.lte("date", filters.end_date);
    }

    if (filters.limit) {
      query = query.limit(filters.limit);
    }

    if (filters.offset) {
      query = query.range(
        filters.offset,
        filters.offset + (filters.limit || 50) - 1
      );
    }

    const { data, error } = await query;

    if (error) {
      throw new Error(error.message);
    }

    return data.map((transaction) => new Transaction(transaction));
  }

  // Get a specific transaction by ID and user
  static async findById(id, userId) {
    const { data, error } = await supabase
      .from("transactions")
      .select("*")
      .eq("id", id)
      .eq("user_id", userId)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return null; // Not found
      }
      throw new Error(error.message);
    }

    return new Transaction(data);
  }

  // Update a transaction
  static async update(id, userId, updateData) {
    const { data, error } = await supabase
      .from("transactions")
      .update({
        title: updateData.title,
        description: updateData.description,
        amount: updateData.amount,
        category: updateData.category,
        transaction_type: updateData.transaction_type,
        date: updateData.date,
      })
      .eq("id", id)
      .eq("user_id", userId)
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return new Transaction(data);
  }

  // Delete a transaction
  static async delete(id, userId) {
    const { error } = await supabase
      .from("transactions")
      .delete()
      .eq("id", id)
      .eq("user_id", userId);

    if (error) {
      throw new Error(error.message);
    }

    return true;
  }

  // Get transaction statistics for a user
  static async getStats(userId, filters = {}) {
    let query = supabase
      .from("transactions")
      .select("amount, transaction_type")
      .eq("user_id", userId);

    // Apply date filters
    if (filters.start_date) {
      query = query.gte("date", filters.start_date);
    }

    if (filters.end_date) {
      query = query.lte("date", filters.end_date);
    }

    const { data, error } = await query;

    if (error) {
      throw new Error(error.message);
    }

    const stats = {
      total_income: 0,
      total_expenses: 0,
      net_balance: 0,
      transaction_count: data.length,
    };

    data.forEach((transaction) => {
      const amount = parseFloat(transaction.amount);
      if (transaction.transaction_type === "income") {
        stats.total_income += amount;
      } else {
        stats.total_expenses += amount;
      }
    });

    stats.net_balance = stats.total_income - stats.total_expenses;

    return stats;
  }

  // Get category-wise spending
  static async getCategoryStats(userId, filters = {}) {
    let query = supabase
      .from("transactions")
      .select("category, amount, transaction_type")
      .eq("user_id", userId);

    // Apply date filters
    if (filters.start_date) {
      query = query.gte("date", filters.start_date);
    }

    if (filters.end_date) {
      query = query.lte("date", filters.end_date);
    }

    if (filters.transaction_type) {
      query = query.eq("transaction_type", filters.transaction_type);
    }

    const { data, error } = await query;

    if (error) {
      throw new Error(error.message);
    }

    const categoryStats = {};

    data.forEach((transaction) => {
      const category = transaction.category;
      const amount = parseFloat(transaction.amount);

      if (!categoryStats[category]) {
        categoryStats[category] = {
          category,
          total_amount: 0,
          transaction_count: 0,
          transaction_type: transaction.transaction_type,
        };
      }

      categoryStats[category].total_amount += amount;
      categoryStats[category].transaction_count += 1;
    });

    return Object.values(categoryStats).sort(
      (a, b) => b.total_amount - a.total_amount
    );
  }
}

module.exports = Transaction;
