# API Testing Guide

This guide covers different ways to test the Xpense Backend APIs.

## Prerequisites

1. **Start the server**: Make sure your backend server is running

   ```bash
   npm run dev
   ```

2. **Setup Supabase**: Ensure your Supabase database is configured with the schema from `database/schema.sql`

3. **Environment Variables**: Verify your `.env` file has correct Supabase credentials

## Testing Methods

### 1. Using Postman/Insomnia (Recommended)

### 2. Using cURL commands

### 3. Using Thunder Client (VS Code Extension)

### 4. Using the provided test script

---

## Method 1: Postman Collection

Import this collection into Postman:

### Base URL

```
http://localhost:3000
```

### Environment Variables in Postman

Create these variables in Postman:

- `baseUrl`: `http://localhost:3000`
- `accessToken`: (will be set after login)
- `refreshToken`: (will be set after login)

---

## Method 2: cURL Testing Commands

### Authentication Flow

#### 1. Register a New User

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "securepassword123",
    "fullName": "Test User"
  }'
```

#### 2. Login User

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "securepassword123"
  }'
```

**Save the `access_token` from the response for subsequent requests!**

#### 3. Test Protected Route

```bash
curl -X GET http://localhost:3000/api/protected/profile \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN_HERE"
```

### Transaction Testing

#### 4. Get All Categories

```bash
curl -X GET http://localhost:3000/api/categories \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN_HERE"
```

#### 5. Create a Transaction

```bash
curl -X POST http://localhost:3000/api/transactions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN_HERE" \
  -d '{
    "title": "Lunch at restaurant",
    "description": "Business lunch meeting",
    "amount": 25.50,
    "category": "Food & Dining",
    "transaction_type": "expense",
    "date": "2024-01-15"
  }'
```

#### 6. Get All Transactions

```bash
curl -X GET http://localhost:3000/api/transactions \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN_HERE"
```

#### 7. Get Transactions with Filters

```bash
# Filter by category and type
curl -X GET "http://localhost:3000/api/transactions?category=Food%20%26%20Dining&transaction_type=expense&limit=10" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN_HERE"

# Filter by date range
curl -X GET "http://localhost:3000/api/transactions?start_date=2024-01-01&end_date=2024-01-31" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN_HERE"
```

#### 8. Update a Transaction

```bash
curl -X PUT http://localhost:3000/api/transactions/TRANSACTION_ID_HERE \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN_HERE" \
  -d '{
    "title": "Updated lunch expense",
    "amount": 30.00,
    "description": "Updated description"
  }'
```

#### 9. Get Transaction Statistics

```bash
curl -X GET http://localhost:3000/api/transactions/stats/summary \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN_HERE"
```

#### 10. Get Category Statistics

```bash
curl -X GET http://localhost:3000/api/transactions/stats/categories \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN_HERE"
```

### Category Management

#### 11. Create Custom Category

```bash
curl -X POST http://localhost:3000/api/categories/custom \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN_HERE" \
  -d '{
    "name": "My Custom Category",
    "icon": "🎯",
    "color": "#FF5733"
  }'
```

#### 12. Get Custom Categories

```bash
curl -X GET http://localhost:3000/api/categories/custom \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN_HERE"
```

---

## Method 3: Thunder Client (VS Code Extension)

Install Thunder Client extension in VS Code, then create requests with these details:

### 1. Register User

- **Method**: POST
- **URL**: `http://localhost:3000/api/auth/register`
- **Headers**: `Content-Type: application/json`
- **Body**:

```json
{
  "email": "test@example.com",
  "password": "securepassword123",
  "fullName": "Test User"
}
```

### 2. Login User

- **Method**: POST
- **URL**: `http://localhost:3000/api/auth/login`
- **Headers**: `Content-Type: application/json`
- **Body**:

```json
{
  "email": "test@example.com",
  "password": "securepassword123"
}
```

### 3. Create Transaction

- **Method**: POST
- **URL**: `http://localhost:3000/api/transactions`
- **Headers**:
  - `Content-Type: application/json`
  - `Authorization: Bearer YOUR_ACCESS_TOKEN`
- **Body**:

```json
{
  "title": "Coffee purchase",
  "description": "Morning coffee",
  "amount": 4.5,
  "category": "Food & Dining",
  "transaction_type": "expense"
}
```

---

## Testing Scenarios

### Complete User Journey Test

1. **Register** → Get user account
2. **Login** → Get access token
3. **Get Categories** → See available categories
4. **Create Transactions** → Add some income and expenses
5. **Filter Transactions** → Test different filters
6. **Get Statistics** → View spending summary
7. **Create Custom Category** → Add personal category
8. **Update Transaction** → Modify existing transaction
9. **Delete Transaction** → Remove a transaction

### Error Testing Scenarios

Test these error cases:

1. **Authentication Errors**:

   - Login with wrong credentials
   - Access protected route without token
   - Use expired/invalid token

2. **Validation Errors**:

   - Create transaction without required fields
   - Use negative amount
   - Use invalid transaction_type
   - Use non-existent category

3. **Not Found Errors**:
   - Get/update/delete non-existent transaction
   - Access another user's transaction

---

## Expected Response Formats

### Success Response

```json
{
  "success": true,
  "data": { ... },
  "message": "Operation completed successfully"
}
```

### Error Response

```json
{
  "success": false,
  "error": "Error message description"
}
```

### Authentication Response

```json
{
  "message": "Login successful",
  "user": {
    "id": "uuid",
    "email": "test@example.com",
    "fullName": "Test User"
  },
  "session": {
    "access_token": "eyJ...",
    "refresh_token": "...",
    "expires_in": 3600
  }
}
```

---

## Health Check

Always start with the health check to ensure the server is running:

```bash
curl -X GET http://localhost:3000/api/health
```

Expected response:

```json
{
  "message": "Server is running",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "environment": "development"
}
```

---

## Tips for Testing

1. **Save Access Token**: After login, save the access_token for subsequent requests
2. **Use Environment Variables**: In Postman, use variables to avoid copying tokens manually
3. **Test Error Cases**: Don't just test happy paths, test validation and error scenarios
4. **Check Database**: Use Supabase dashboard to verify data changes
5. **Test Pagination**: Use limit/offset parameters for large datasets
6. **Date Formats**: Use YYYY-MM-DD format for date parameters

## Common Issues & Solutions

### Issue: "Access token required"

**Solution**: Include `Authorization: Bearer YOUR_TOKEN` header

### Issue: "Invalid category"

**Solution**: Use exact category name from `/api/categories` endpoint

### Issue: "Transaction not found"

**Solution**: Use correct transaction ID from user's own transactions

### Issue: Database connection error

**Solution**: Check Supabase configuration in `.env` file
