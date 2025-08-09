#!/usr/bin/env node

const axios = require("axios");

// Configuration
const BASE_URL = "http://localhost:3000";
let ACCESS_TOKEN = "";

// ANSI color codes for console output
const colors = {
  green: "\x1b[32m",
  red: "\x1b[31m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  reset: "\x1b[0m",
  bold: "\x1b[1m",
};

function log(message, color = "reset") {
  console.log(colors[color] + message + colors.reset);
}

function logTest(testName) {
  console.log(
    "\n" + colors.bold + colors.blue + "🧪 Testing: " + testName + colors.reset
  );
}

function logSuccess(message) {
  log("✅ " + message, "green");
}

function logError(message) {
  log("❌ " + message, "red");
}

function logWarning(message) {
  log("⚠️  " + message, "yellow");
}

// Helper function to make API requests
async function apiRequest(method, endpoint, data = null, useAuth = false) {
  const config = {
    method,
    url: `${BASE_URL}${endpoint}`,
    headers: {
      "Content-Type": "application/json",
    },
  };

  if (useAuth && ACCESS_TOKEN) {
    config.headers.Authorization = `Bearer ${ACCESS_TOKEN}`;
  }

  if (data) {
    config.data = data;
  }

  try {
    const response = await axios(config);
    return { success: true, data: response.data, status: response.status };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data || error.message,
      status: error.response?.status || 500,
    };
  }
}

// Test functions
async function testHealthCheck() {
  logTest("Health Check");
  const result = await apiRequest("GET", "/api/health");

  if (result.success && result.status === 200) {
    logSuccess("Health check passed");
    console.log("   Server response:", result.data.message);
    return true;
  } else {
    logError("Health check failed");
    console.log("   Error:", result.error);
    return false;
  }
}

async function testUserRegistration() {
  logTest("User Registration");
  const userData = {
    email: "adithkannuzz@628.com",
    password: "testpassword123",
    fullName: "Test User",
  };

  const result = await apiRequest("POST", "/api/auth/register", userData);

  if (result.success && result.status === 201) {
    logSuccess("User registration successful");
    if (result.data.session?.access_token) {
      ACCESS_TOKEN = result.data.session.access_token;
      logSuccess("Access token obtained");
    }
    return true;
  } else {
    // User might already exist, try login instead
    if (
      result.status === 400 &&
      result.error.error?.includes("already registered")
    ) {
      logWarning("User already exists, will try login");
      return await testUserLogin();
    }
    logError("User registration failed");
    console.log("   Error:", result.error);
    return false;
  }
}

async function testUserLogin() {
  logTest("User Login");
  const loginData = {
    email: "adithkannuzz@628.com",
    password: "testpassword123",
  };

  const result = await apiRequest("POST", "/api/auth/login", loginData);

  if (result.success && result.status === 200) {
    logSuccess("User login successful");
    ACCESS_TOKEN = result.data.session.access_token;
    logSuccess("Access token updated");
    return true;
  } else {
    logError("User login failed");
    console.log("   Error:", result.error);
    return false;
  }
}

async function testGetProfile() {
  logTest("Get User Profile");
  const result = await apiRequest("GET", "/api/protected/profile", null, true);

  if (result.success && result.status === 200) {
    logSuccess("Profile retrieval successful");
    console.log("   User:", result.data.user.email);
    return true;
  } else {
    logError("Profile retrieval failed");
    console.log("   Error:", result.error);
    return false;
  }
}

async function testGetCategories() {
  logTest("Get Categories");
  const result = await apiRequest("GET", "/api/categories", null, true);

  if (result.success && result.status === 200) {
    logSuccess(`Categories retrieved (${result.data.data.length} categories)`);
    console.log(
      "   Sample categories:",
      result.data.data
        .slice(0, 3)
        .map((cat) => cat.name)
        .join(", ")
    );
    return result.data.data;
  } else {
    logError("Categories retrieval failed");
    console.log("   Error:", result.error);
    return null;
  }
}

async function testCreateTransaction(categories) {
  logTest("Create Transaction");
  const transactionData = {
    title: "Test Expense Transaction",
    description: "Testing API transaction creation",
    amount: 25.99,
    category:
      categories && categories.length > 0 ? categories[0].name : "Other",
    transaction_type: "expense",
    date: new Date().toISOString().split("T")[0],
  };

  const result = await apiRequest(
    "POST",
    "/api/transactions",
    transactionData,
    true
  );

  if (result.success && result.status === 201) {
    logSuccess("Transaction created successfully");
    console.log("   Transaction ID:", result.data.data.id);
    return result.data.data;
  } else {
    logError("Transaction creation failed");
    console.log("   Error:", result.error);
    return null;
  }
}

async function testGetTransactions() {
  logTest("Get Transactions");
  const result = await apiRequest("GET", "/api/transactions", null, true);

  if (result.success && result.status === 200) {
    logSuccess(
      `Transactions retrieved (${result.data.data.length} transactions)`
    );
    return result.data.data;
  } else {
    logError("Transactions retrieval failed");
    console.log("   Error:", result.error);
    return null;
  }
}

async function testUpdateTransaction(transaction) {
  if (!transaction) return false;

  logTest("Update Transaction");
  const updateData = {
    title: "Updated Test Transaction",
    amount: 30.99,
  };

  const result = await apiRequest(
    "PUT",
    `/api/transactions/${transaction.id}`,
    updateData,
    true
  );

  if (result.success && result.status === 200) {
    logSuccess("Transaction updated successfully");
    return true;
  } else {
    logError("Transaction update failed");
    console.log("   Error:", result.error);
    return false;
  }
}

async function testGetTransactionStats() {
  logTest("Get Transaction Statistics");
  const result = await apiRequest(
    "GET",
    "/api/transactions/stats/summary",
    null,
    true
  );

  if (result.success && result.status === 200) {
    logSuccess("Transaction statistics retrieved");
    console.log("   Total expenses:", result.data.data.total_expenses);
    console.log("   Total income:", result.data.data.total_income);
    console.log("   Net balance:", result.data.data.net_balance);
    return true;
  } else {
    logError("Transaction statistics failed");
    console.log("   Error:", result.error);
    return false;
  }
}

async function testCreateCustomCategory() {
  logTest("Create Custom Category");
  const categoryData = {
    name: "Test Custom Category",
    icon: "🧪",
    color: "#FF5733",
  };

  const result = await apiRequest(
    "POST",
    "/api/categories/custom",
    categoryData,
    true
  );

  if (result.success && result.status === 201) {
    logSuccess("Custom category created successfully");
    return result.data.data;
  } else {
    logError("Custom category creation failed");
    console.log("   Error:", result.error);
    return null;
  }
}

async function testDeleteTransaction(transaction) {
  if (!transaction) return false;

  logTest("Delete Transaction");
  const result = await apiRequest(
    "DELETE",
    `/api/transactions/${transaction.id}`,
    null,
    true
  );

  if (result.success && result.status === 200) {
    logSuccess("Transaction deleted successfully");
    return true;
  } else {
    logError("Transaction deletion failed");
    console.log("   Error:", result.error);
    return false;
  }
}

// Main test runner
async function runTests() {
  console.log(
    colors.bold +
      colors.blue +
      "🚀 Starting Xpense Backend API Tests" +
      colors.reset
  );
  console.log("Base URL:", BASE_URL);

  let passedTests = 0;
  let totalTests = 0;

  const tests = [
    testHealthCheck,
    testUserRegistration,
    testGetProfile,
    async () => {
      const categories = await testGetCategories();
      if (categories) {
        totalTests += 3;
        const transaction = await testCreateTransaction(categories);
        if (transaction) passedTests++;

        const transactions = await testGetTransactions();
        if (transactions) passedTests++;

        const updated = await testUpdateTransaction(transaction);
        if (updated) passedTests++;

        return transaction;
      }
      return null;
    },
    testGetTransactionStats,
    testCreateCustomCategory,
    async (transaction) => {
      return await testDeleteTransaction(transaction);
    },
  ];

  let transaction = null;
  for (const test of tests) {
    totalTests++;
    try {
      const result = await test(transaction);
      if (result === true || (result && typeof result === "object")) {
        passedTests++;
        if (typeof result === "object" && result.id) {
          transaction = result;
        }
      }
    } catch (error) {
      logError(`Test failed with error: ${error.message}`);
    }
  }

  // Add the extra tests from the anonymous function
  totalTests += 3;

  console.log("\n" + colors.bold + "📊 Test Results" + colors.reset);
  console.log(`Total Tests: ${totalTests}`);
  console.log(`Passed: ${colors.green}${passedTests}${colors.reset}`);
  console.log(
    `Failed: ${colors.red}${totalTests - passedTests}${colors.reset}`
  );

  if (passedTests === totalTests) {
    logSuccess("All tests passed! 🎉");
  } else {
    logWarning(
      `${totalTests - passedTests} tests failed. Check the logs above.`
    );
  }
}

// Run tests if this script is executed directly
if (require.main === module) {
  runTests().catch(console.error);
}

module.exports = { runTests };
