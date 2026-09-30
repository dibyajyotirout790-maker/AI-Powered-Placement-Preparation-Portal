const express = require('express');
const cors = require('cors');
require('dotenv').config();

const connectDB = require('./config/db');

const authRoutes = require('./routes/auth');
const jobRoutes = require('./routes/jobRoutes');
const aiRoutes = require('./routes/aiRoutes');

const app = express();

// ===============================
// DATABASE
// ===============================
connectDB();

// ===============================
// CORS
// ===============================
const allowedOrigins = [
  'http://localhost:4200',
  'http://localhost:4201',
  'https://ai-powered-placement-preparation-portal-juqep4kyg-place-x.vercel.app'
];

app.use(
  cors({
    origin: function (origin, callback) {

      // Allow requests with no origin
      // (Postman, server-to-server requests, etc.)
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error('Not allowed by CORS'));
    },

    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],

    allowedHeaders: [
      'Content-Type',
      'Authorization'
    ],

    credentials: true
  })
);

// Handle preflight requests
app.options('*', cors());

// ===============================
// BODY PARSER
// ===============================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ===============================
// TEST ROUTE
// ===============================
app.get('/', (req, res) => {
  res.json({
    message: 'AI Placement Portal Backend is running'
  });
});

// ===============================
// API ROUTES
// ===============================
app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/ai', aiRoutes);

// ===============================
// 404 HANDLER
// ===============================
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'API route not found',
    path: req.originalUrl
  });
});

// ===============================
// ERROR HANDLER
// ===============================
app.use((err, req, res, next) => {

  console.error('Server Error:', err);

  res.status(500).json({
    success: false,
    message: err.message || 'Internal server error'
  });
});

// ===============================
// SERVER
// ===============================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`PlaceX server running on port ${PORT}`);
});