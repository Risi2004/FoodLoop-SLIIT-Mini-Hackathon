const express = require('express');
const cors = require('cors');
require('dotenv').config();

const connectDB = require('./src/config/db');
const apiRouter = require('./src/routes');
const errorHandler = require('./src/middleware/error.middleware');
const ApiError = require('./src/utils/ApiError');

// Initialize express app
const app = express();

// Connect to MongoDB
connectDB();

// Middlewares
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Root welcome route
app.get('/', (req, res) => {
  res.json({
    message: 'FoodLoop API Gateway is running 🚀',
    version: '1.0.0',
    documentation: '/api/health'
  });
});

// API Routes
app.use('/api', apiRouter);

// Catch 404 and forward to error handler
app.use((req, res, next) => {
  next(new ApiError(404, `Cannot ${req.method} ${req.originalUrl} - Route not found`));
});

// Centralized Error Handling Middleware
app.use(errorHandler);

// Port
const PORT = process.env.PORT || 5000;

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 FoodLoop Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});