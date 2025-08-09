const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
require("dotenv").config();

const authRoutes = require("./routes/auth");
const protectedRoutes = require("./routes/protected");
const transactionRoutes = require("./routes/transactions");
const categoryRoutes = require("./routes/categories");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet());

// CORS Configuration
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);

    // Define allowed origins - include localhost for development from any environment
    const allowedOrigins = [
      // Production domains
      'https://yourdomain.com',
      'https://your-frontend-app.vercel.app',
      'https://your-frontend-app.netlify.app',
      /\.railway\.app$/, // Allow any Railway subdomain
      /\.up\.railway\.app$/, // Railway's new domain format
      
      // Development/Local domains (always allowed for testing)
      'http://localhost:3000',
      'http://localhost:3001',
      'http://localhost:5173', // Vite default
      'http://localhost:5174', // Alternative Vite port
      'http://localhost:4173', // Vite preview
      'http://localhost:8080', // Alternative dev server
      'http://127.0.0.1:3000',
      'http://127.0.0.1:3001',
      'http://127.0.0.1:5173',
      'http://127.0.0.1:5174',
      'http://127.0.0.1:8080',
      
      // Add any other localhost ports you might use
      /^http:\/\/localhost:\d+$/,
      /^http:\/\/127\.0\.0\.1:\d+$/,
    ];

    // Check if origin is allowed
    const isAllowed = allowedOrigins.some((allowedOrigin) => {
      if (typeof allowedOrigin === "string") {
        return allowedOrigin === origin;
      }
      if (allowedOrigin instanceof RegExp) {
        return allowedOrigin.test(origin);
      }
      return false;
    });

    // Debug logging for CORS (only in development or when CORS_DEBUG is enabled)
    if (process.env.NODE_ENV === 'development' || process.env.CORS_DEBUG === 'true') {
      console.log(`CORS Request - Origin: ${origin}, Allowed: ${isAllowed}`);
    }

    if (isAllowed) {
      callback(null, true);
    } else {
      console.error(`CORS Error - Origin not allowed: ${origin}`);
      callback(new Error(`Not allowed by CORS. Origin: ${origin}`));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/protected", protectedRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/categories", categoryRoutes);

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.status(200).json({
    message: "Server is running",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
  });
});

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
});
