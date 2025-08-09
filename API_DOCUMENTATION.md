# Xpense Backend API Documentation

## Authentication

All protected endpoints require a Bearer token in the Authorization header:

```
Authorization: Bearer <your_access_token>
```

## Authentication Endpoints

### POST /api/auth/register

Register a new user.

**Request Body:**

```json
{
  "email": "user@example.com",
  "password": "securepassword",
  "fullName": "John Doe"
}
```

**Response:**

```json
{
  "message": "User registered successfully",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "fullName": "John Doe"
  },
  "session": {
    "access_token": "...",
    "refresh_token": "..."
  }
}
```

### POST /api/auth/login

Login an existing user.

**Request Body:**

```json
{
  "email": "user@example.com",
  "password": "securepassword"
}
```

### POST /api/auth/logout

Logout the current user.

### POST /api/auth/refresh

Refresh the access token.

**Request Body:**

```json
{
  "refresh_token": "your_refresh_token"
}
```

### POST /api/auth/reset-password

Request password reset email.

**Request Body:**

```json
{
  "email": "user@example.com"
}
```

## Protected Endpoints

### GET /api/protected/profile

Get user profile information.

### PUT /api/protected/profile

Update user profile.

**Request Body:**

```json
{
  "fullName": "Updated Name"
}
```

## Transaction Endpoints

### GET /api/transactions

Get all transactions for the authenticated user.

**Query Parameters:**

- `category` (optional): Filter by category name
- `transaction_type` (optional): Filter by type ('income' or 'expense')
- `start_date` (optional): Filter transactions from this date (YYYY-MM-DD)
- `end_date` (optional): Filter transactions up to this date (YYYY-MM-DD)
- `limit` (optional): Number of transactions to return (default: 50)
- `offset` (optional): Number of transactions to skip (default: 0)

**Example Request:**

```
GET /api/transactions?category=Food%20%26%20Dining&transaction_type=expense&limit=10
```

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "user_id": "uuid",
      "title": "Lunch at restaurant",
      "description": "Business lunch meeting",
      "amount": "25.50",
      "category": "Food & Dining",
      "transaction_type": "expense",
      "date": "2024-01-15",
      "created_at": "2024-01-15T10:30:00Z",
      "updated_at": "2024-01-15T10:30:00Z"
    }
  ],
  "pagination": {
    "limit": 10,
    "offset": 0,
    "total": 1
  }
}
```

### GET /api/transactions/:id

Get a specific transaction by ID.

**Response:**

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "title": "Lunch at restaurant",
    "description": "Business lunch meeting",
    "amount": "25.50",
    "category": "Food & Dining",
    "transaction_type": "expense",
    "date": "2024-01-15"
  }
}
```

### POST /api/transactions

Create a new transaction.

**Request Body:**

```json
{
  "title": "Lunch at restaurant",
  "description": "Business lunch meeting",
  "amount": 25.5,
  "category": "Food & Dining",
  "transaction_type": "expense",
  "date": "2024-01-15"
}
```

**Required Fields:**

- `title`: Transaction title
- `amount`: Transaction amount (must be > 0)
- `category`: Category name (must exist in default or user categories)

**Optional Fields:**

- `description`: Transaction description
- `transaction_type`: 'income' or 'expense' (default: 'expense')
- `date`: Transaction date in YYYY-MM-DD format (default: today)

**Response:**

```json
{
  "success": true,
  "message": "Transaction created successfully",
  "data": {
    "id": "uuid",
    "title": "Lunch at restaurant",
    "amount": "25.50",
    "category": "Food & Dining",
    "transaction_type": "expense",
    "date": "2024-01-15"
  }
}
```

### PUT /api/transactions/:id

Update an existing transaction.

**Request Body:**

```json
{
  "title": "Updated lunch expense",
  "amount": 30.0,
  "description": "Updated description"
}
```

### DELETE /api/transactions/:id

Delete a transaction.

**Response:**

```json
{
  "success": true,
  "message": "Transaction deleted successfully"
}
```

### GET /api/transactions/stats/summary

Get transaction statistics summary.

**Query Parameters:**

- `start_date` (optional): Statistics from this date
- `end_date` (optional): Statistics up to this date

**Response:**

```json
{
  "success": true,
  "data": {
    "total_income": 5000.0,
    "total_expenses": 3500.0,
    "net_balance": 1500.0,
    "transaction_count": 45
  }
}
```

### GET /api/transactions/stats/categories

Get category-wise spending statistics.

**Query Parameters:**

- `start_date` (optional): Statistics from this date
- `end_date` (optional): Statistics up to this date
- `transaction_type` (optional): Filter by 'income' or 'expense'

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "category": "Food & Dining",
      "total_amount": 450.0,
      "transaction_count": 15,
      "transaction_type": "expense"
    },
    {
      "category": "Transportation",
      "total_amount": 300.0,
      "transaction_count": 8,
      "transaction_type": "expense"
    }
  ]
}
```

## Category Endpoints

### GET /api/categories

Get all categories available to the user (default + custom categories).

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "Food & Dining",
      "icon": "🍽️",
      "color": "#FF6B6B",
      "created_at": "2024-01-01T00:00:00Z"
    },
    {
      "id": "uuid",
      "name": "My Custom Category",
      "icon": "💼",
      "color": "#4ECDC4",
      "created_at": "2024-01-15T10:00:00Z",
      "user_id": "uuid"
    }
  ]
}
```

### GET /api/categories/default

Get only the default system categories.

### GET /api/categories/custom

Get only the user's custom categories.

### POST /api/categories/custom

Create a new custom category.

**Request Body:**

```json
{
  "name": "My Custom Category",
  "icon": "💼",
  "color": "#4ECDC4"
}
```

**Required Fields:**

- `name`: Category name (must be unique for the user)

**Optional Fields:**

- `icon`: Category icon (default: '📝')
- `color`: Category color in hex format (default: '#85C1E9')

### PUT /api/categories/custom/:id

Update a custom category.

**Request Body:**

```json
{
  "name": "Updated Category Name",
  "icon": "🎯",
  "color": "#FF5733"
}
```

### DELETE /api/categories/custom/:id

Delete a custom category.

## Default Categories

The system comes with these predefined categories:

**Expense Categories:**

- Food & Dining 🍽️
- Transportation 🚗
- Shopping 🛒
- Entertainment 🎬
- Bills & Utilities ⚡
- Healthcare 🏥
- Education 📚
- Travel ✈️
- Business 💼
- Other 📝

**Income Categories:**

- Salary 💰
- Freelance 💻
- Investment 📈
- Gift 🎁

## Error Responses

All endpoints return errors in the following format:

```json
{
  "success": false,
  "error": "Error message description"
}
```

Common HTTP status codes:

- `400`: Bad Request (validation errors)
- `401`: Unauthorized (missing or invalid token)
- `403`: Forbidden (token expired or invalid)
- `404`: Not Found (resource doesn't exist)
- `500`: Internal Server Error

## Database Schema

### Transactions Table

```sql
- id (UUID, Primary Key)
- user_id (UUID, Foreign Key to auth.users)
- title (VARCHAR(255), NOT NULL)
- description (TEXT)
- amount (DECIMAL(10,2), NOT NULL)
- category (VARCHAR(100), NOT NULL)
- transaction_type (VARCHAR(20), DEFAULT 'expense')
- date (DATE, DEFAULT CURRENT_DATE)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

### Categories Table (System Categories)

```sql
- id (UUID, Primary Key)
- name (VARCHAR(100), UNIQUE, NOT NULL)
- icon (VARCHAR(50))
- color (VARCHAR(7))
- created_at (TIMESTAMP)
```

### User Categories Table (Custom Categories)

```sql
- id (UUID, Primary Key)
- user_id (UUID, Foreign Key to auth.users)
- name (VARCHAR(100), NOT NULL)
- icon (VARCHAR(50))
- color (VARCHAR(7))
- created_at (TIMESTAMP)
- UNIQUE(user_id, name)
```

## Security Features

- **Row Level Security (RLS)**: Users can only access their own transactions and categories
- **JWT Authentication**: Secure token-based authentication via Supabase
- **Input Validation**: All inputs are validated before database operations
- **CORS Protection**: Configured for specific domains
- **Helmet.js**: Security headers for protection against common vulnerabilities
