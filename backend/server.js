const express = require('express');
const cors = require('cors');
require('dotenv').config();

const connectDB = require('./config/db');

const authRoutes = require('./routes/auth');
const jobRoutes = require('./routes/jobRoutes');
const aiRoutes = require('./routes/aiRoutes');

const app = express();

// =====================================================
// CORS
// =====================================================

const allowedOrigins = [
  'http://localhost:4200',
  'http://localhost:4201',

  // Your current Vercel frontend
  'https://ai-powered-placement-preparation-portal-juqep4kyg-place-x.vercel.app'
];

app.use(
  cors({
    origin: function (origin, callback) {

      // Allow requests without an Origin
      // Example: Postman/server-to-server
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      console.log('Blocked CORS origin:', origin);

      return callback(new Error('Not allowed by CORS'));
    },

    methods: [
      'GET',
      'POST',
      'PUT',
      'PATCH',
      'DELETE',
      'OPTIONS'
    ],

    allowedHeaders: [
      'Content-Type',
      'Authorization'
    ],

    credentials: true
  })
);

// =====================================================
// BODY PARSER
// =====================================================

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// =====================================================
// HEALTH / TEST ROUTE
// =====================================================

app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'AI Placement Portal Backend is running',
    environment: process.env.NODE_ENV || 'production'
  });
});

// =====================================================
// DATABASE CONNECTION
// =====================================================

// Connect to MongoDB before API requests
app.use('/api', async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    console.error('Database connection error:', error);

    res.status(500).json({
      success: false,
      message: 'Database connection failed'
    });
  }
});

// =====================================================
// API ROUTES
// =====================================================

app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/ai', aiRoutes);

// =====================================================
// 404 HANDLER
// =====================================================

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'API route not found',
    path: req.originalUrl
  });
});

// =====================================================
// ERROR HANDLER
// =====================================================

app.use((err, req, res, next) => {
  console.error('Server Error:', err);

  res.status(500).json({
    success: false,
    message: err.message || 'Internal server error'
  });
});

// =====================================================
// VERCEL EXPORT
// =====================================================

module.exports = app;