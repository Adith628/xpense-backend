# Xpense Backend

A comprehensive Node.js Express backend server with Supabase authentication and expense tracking functionality.

## Features

### Authentication

- User registration and login
- Password reset functionality
- Token refresh
- Protected routes
- User profile management

### Expense Tracking

- Create, read, update, delete transactions
- Income and expense categorization
- Default and custom categories
- Transaction filtering and pagination
- Statistical analysis and reporting
- Category-wise spending insights
- Date range filtering

### Security & Infrastructure

- CORS and security middleware
- Row Level Security (RLS) with Supabase
- Environment-based configuration
- Input validation and error handling

## Database Schema

The application uses the following main tables:

- **transactions**: Store all user transactions with categories and amounts
- **categories**: System-wide default categories
- **user_categories**: User-specific custom categories

Each authenticated user has isolated access to their own transactions and categories through Supabase RLS policies.

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Supabase account and project

### Installation

1. Clone the repository:

   ```bash
   git clone <your-repo-url>
   cd xpense-backend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up environment variables:

   ```bash
   cp .env.example .env
   ```

4. Update the `.env` file with your Supabase credentials:
   ```
   SUPABASE_URL=your_supabase_project_url
   SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
   JWT_SECRET=your_jwt_secret_key
   PORT=3000
   NODE_ENV=development
   ```

### Supabase Setup

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to Settings > API to find your project URL and API keys
3. Copy the URL, anon key, and service role key to your `.env` file
4. Run the database schema setup:
   - Go to the SQL editor in your Supabase dashboard
   - Copy and execute the contents of `database/schema.sql`
   - This will create the necessary tables, RLS policies, and default categories

### Running the Server

Development mode:

```bash
npm run dev
```

Production mode:

```bash
npm start
```

The server will start on `http://localhost:3000` (or the port specified in your .env file).

## API Endpoints

### Authentication Endpoints

- `GET /api/health` - Health check
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `POST /api/auth/refresh` - Refresh access token
- `POST /api/auth/reset-password` - Request password reset
- `POST /api/auth/update-password` - Update password

### Protected User Endpoints

- `GET /api/protected/profile` - Get user profile
- `PUT /api/protected/profile` - Update user profile
- `GET /api/protected/test` - Test protected route

### Transaction Endpoints

- `GET /api/transactions` - Get user transactions (with filtering)
- `GET /api/transactions/:id` - Get specific transaction
- `POST /api/transactions` - Create new transaction
- `PUT /api/transactions/:id` - Update transaction
- `DELETE /api/transactions/:id` - Delete transaction
- `GET /api/transactions/stats/summary` - Get transaction statistics
- `GET /api/transactions/stats/categories` - Get category-wise statistics

### Category Endpoints

- `GET /api/categories` - Get all categories (default + custom)
- `GET /api/categories/default` - Get default categories
- `GET /api/categories/custom` - Get user's custom categories
- `POST /api/categories/custom` - Create custom category
- `PUT /api/categories/custom/:id` - Update custom category
- `DELETE /api/categories/custom/:id` - Delete custom category

For detailed API documentation with request/response examples, see [API_DOCUMENTATION.md](./API_DOCUMENTATION.md).

## Authentication

The API uses Supabase authentication with JWT tokens. Include the access token in the Authorization header:

```
Authorization: Bearer <your_access_token>
```

## Request/Response Examples

### Register User

```bash
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepassword",
  "fullName": "John Doe"
}
```

### Login User

```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepassword"
}
```

### Access Protected Route

```bash
GET /api/protected/profile
Authorization: Bearer <access_token>
```

## Project Structure

```
xpense-backend/
├── config/
│   └── supabase.js          # Supabase configuration
├── database/
│   └── schema.sql           # Database schema and setup
├── middleware/
│   └── auth.js              # Authentication middleware
├── models/
│   ├── Transaction.js       # Transaction model with business logic
│   └── Category.js          # Category model with business logic
├── routes/
│   ├── auth.js              # Authentication routes
│   ├── protected.js         # Protected user routes
│   ├── transactions.js      # Transaction management routes
│   └── categories.js        # Category management routes
├── .env.example             # Environment variables template
├── .gitignore
├── package.json
├── server.js                # Main server file
├── README.md
└── API_DOCUMENTATION.md     # Detailed API documentation
```

## Security Features

- Helmet.js for security headers
- CORS configuration
- Input validation
- Secure JWT token handling
- Environment variable protection

## Development

### Adding New Routes

1. Create a new file in the `routes/` directory
2. Import and use the authentication middleware for protected routes
3. Add the route to `server.js`

### Environment Variables

Make sure to update `.env.example` when adding new environment variables and document them in this README.

## License

MIT
