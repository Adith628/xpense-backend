const { supabase } = require("../config/supabase");

class Category {
  constructor(data) {
    this.id = data.id;
    this.name = data.name;
    this.icon = data.icon;
    this.color = data.color;
    this.created_at = data.created_at;
    this.user_id = data.user_id; // Only for user categories
  }

  // Get all default categories
  static async getDefaultCategories() {
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .order("name");

    if (error) {
      throw new Error(error.message);
    }

    return data.map((category) => new Category(category));
  }

  // Get user's custom categories
  static async getUserCategories(userId) {
    const { data, error } = await supabase
      .from("user_categories")
      .select("*")
      .eq("user_id", userId)
      .order("name");

    if (error) {
      throw new Error(error.message);
    }

    return data.map((category) => new Category(category));
  }

  // Get all categories available to a user (default + custom)
  static async getAllUserCategories(userId) {
    const defaultCategories = await this.getDefaultCategories();
    const userCategories = await this.getUserCategories(userId);

    return [...defaultCategories, ...userCategories];
  }

  // Create a custom category for a user
  static async createUserCategory(userId, categoryData) {
    const { data, error } = await supabase
      .from("user_categories")
      .insert({
        user_id: userId,
        name: categoryData.name,
        icon: categoryData.icon,
        color: categoryData.color,
      })
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return new Category(data);
  }

  // Update a user's custom category
  static async updateUserCategory(id, userId, updateData) {
    const { data, error } = await supabase
      .from("user_categories")
      .update({
        name: updateData.name,
        icon: updateData.icon,
        color: updateData.color,
      })
      .eq("id", id)
      .eq("user_id", userId)
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return new Category(data);
  }

  // Delete a user's custom category
  static async deleteUserCategory(id, userId) {
    const { error } = await supabase
      .from("user_categories")
      .delete()
      .eq("id", id)
      .eq("user_id", userId);

    if (error) {
      throw new Error(error.message);
    }

    return true;
  }

  // Check if category exists (either default or custom)
  static async categoryExists(categoryName, userId = null) {
    // Check default categories
    const { data: defaultCategory } = await supabase
      .from("categories")
      .select("id")
      .eq("name", categoryName)
      .single();

    if (defaultCategory) {
      return true;
    }

    // Check user categories if userId provided
    if (userId) {
      const { data: userCategory } = await supabase
        .from("user_categories")
        .select("id")
        .eq("name", categoryName)
        .eq("user_id", userId)
        .single();

      if (userCategory) {
        return true;
      }
    }

    return false;
  }
}

module.exports = Category;
