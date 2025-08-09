# Testing the Xpense Backend API

This folder contains various tools and scripts for testing the Xpense Backend API endpoints.

## 🚀 Quick Start

### Option 1: Automated Node.js Test (Recommended)

```bash
# Install dependencies first (if not done)
npm install

# Run all API tests automatically
npm test
```

### Option 2: Quick Shell Script Test

```bash
# Make script executable (Linux/Mac)
chmod +x tests/quick-test.sh

# Run quick test
./tests/quick-test.sh
```

### Option 3: Manual Testing

Follow the detailed guide in `TESTING_GUIDE.md`

## 📁 Files in this Directory

### `api-test.js`

- **Purpose**: Comprehensive automated test script
- **Usage**: `npm test` or `node tests/api-test.js`
- **Features**:
  - Tests all major API endpoints
  - Automatic user registration/login
  - Transaction CRUD operations
  - Category management
  - Statistics testing
  - Colored console output
  - Pass/fail reporting

### `TESTING_GUIDE.md`

- **Purpose**: Complete manual testing guide
- **Contents**:
  - cURL command examples
  - Postman setup instructions
  - Thunder Client configuration
  - Error testing scenarios
  - Expected response formats

### `postman-collection.json`

- **Purpose**: Postman collection for API testing
- **Usage**: Import into Postman application
- **Features**:
  - Pre-configured requests for all endpoints
  - Environment variables support
  - Automatic token management

### `quick-test.sh`

- **Purpose**: Fast bash script for basic API testing
- **Usage**: `./tests/quick-test.sh`
- **Features**:
  - Health check verification
  - User authentication flow
  - Basic CRUD operations
  - Colored output

### VS Code Thunder Client Files

- `../.vscode/thunder-client-collection.json`: Thunder Client requests
- `../.vscode/thunder-client-environment.json`: Environment variables

## 🧪 Test Coverage

Our tests cover:

### ✅ Authentication

- [x] User registration
- [x] User login
- [x] Protected route access
- [x] Profile retrieval
- [x] Token validation

### ✅ Categories

- [x] Get default categories
- [x] Get all categories (default + custom)
- [x] Create custom categories
- [x] Update custom categories
- [x] Delete custom categories

### ✅ Transactions

- [x] Create transactions (income/expense)
- [x] Get user transactions
- [x] Filter transactions (by category, type, date)
- [x] Pagination support
- [x] Update transactions
- [x] Delete transactions
- [x] Get specific transaction by ID

### ✅ Statistics & Analytics

- [x] Transaction summary (income, expenses, balance)
- [x] Category-wise spending analysis
- [x] Date range filtering
- [x] Transaction counts

### ✅ Error Handling

- [x] Invalid authentication tokens
- [x] Missing required fields
- [x] Invalid data validation
- [x] Non-existent resource access
- [x] Unauthorized access attempts

## 🔧 Prerequisites

Before running tests, ensure:

1. **Backend server is running**:

   ```bash
   npm run dev
   ```

2. **Supabase is configured**:

   - Database schema is applied
   - Environment variables are set
   - Connection is working

3. **Dependencies are installed**:
   ```bash
   npm install
   ```

## 📊 Test Results Example

When running `npm test`, you'll see output like:

```
🚀 Starting Xpense Backend API Tests
Base URL: http://localhost:3000

🧪 Testing: Health Check
✅ Health check passed
   Server response: Server is running

🧪 Testing: User Registration
✅ User registration successful
✅ Access token obtained

🧪 Testing: Get User Profile
✅ Profile retrieval successful
   User: testuser@example.com

🧪 Testing: Get Categories
✅ Categories retrieved (14 categories)
   Sample categories: Food & Dining, Transportation, Shopping

🧪 Testing: Create Transaction
✅ Transaction created successfully
   Transaction ID: uuid-here

📊 Test Results
Total Tests: 10
Passed: 10
Failed: 0
All tests passed! 🎉
```

## 🐛 Troubleshooting

### Common Issues

1. **"Connection refused"**

   - Make sure server is running on port 3000
   - Check if port is available

2. **"Invalid token" errors**

   - Verify Supabase configuration
   - Check environment variables
   - Ensure database schema is applied

3. **"Category does not exist"**

   - Run the database schema setup
   - Check if default categories are inserted

4. **"User already registered"**
   - This is normal - tests will try login instead
   - Or use different email in test scripts

## 📚 Additional Resources

- [Main API Documentation](../API_DOCUMENTATION.md)
- [Database Schema](../database/schema.sql)
- [Project README](../README.md)
- [Supabase Documentation](https://supabase.com/docs)

## 🤝 Contributing

When adding new features to the API:

1. Add corresponding tests in `api-test.js`
2. Update the testing guide with new examples
3. Add new requests to Postman collection
4. Update this README with new test coverage

## 💡 Tips

- **Use environment variables**: Set `BASE_URL` to test against different environments
- **Save tokens**: In manual testing, save access tokens for reuse
- **Check logs**: Monitor server logs while running tests
- **Test edge cases**: Don't just test happy paths
- **Database state**: Tests create data - monitor your database
