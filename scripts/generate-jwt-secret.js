#!/usr/bin/env node

// Generate a secure JWT secret for production
const crypto = require("crypto");

console.log("🔐 JWT Secret Generator for Railway Deployment");
console.log("==============================================\n");

// Generate a secure 32-byte secret
const jwtSecret = crypto.randomBytes(32).toString("hex");

console.log("Generated JWT Secret:");
console.log("📋 Copy this secret for your Railway environment variables:\n");
console.log(`JWT_SECRET=${jwtSecret}\n`);

console.log("⚠️  Important Security Notes:");
console.log("• Keep this secret private and secure");
console.log("• Never commit this secret to version control");
console.log("• Use this exact secret in your Railway project settings");
console.log("• Don't share this secret in chat or email\n");

console.log("🚀 Next Steps:");
console.log("1. Go to your Railway project dashboard");
console.log("2. Navigate to Variables tab");
console.log("3. Add JWT_SECRET with the generated value above");
console.log("4. Deploy your project\n");

// Also generate a backup secret
const backupSecret = crypto.randomBytes(32).toString("hex");
console.log("🔄 Backup JWT Secret (save for future rotation):");
console.log(`JWT_SECRET_BACKUP=${backupSecret}\n`);

console.log("✅ Secrets generated successfully!");
