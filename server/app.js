const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const fs = require('fs');

const authRoutes = require('./routes/authRoutes');
const contentCatalogRoutes = require('./routes/contentCatalogRoutes');
const creationRoutes = require('./routes/creationRoutes');
const profileRoutes = require('./routes/profileRoutes');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'AI-Powered Universal Content Creation Platform API',
    version: '1.0.0'
  });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/content-types', contentCatalogRoutes);
app.use('/api/creations', creationRoutes);
app.use('/api/profiles', profileRoutes);

// Serve the production-built React frontend
const clientDistPath = path.resolve(__dirname, '../client/dist');

if (fs.existsSync(clientDistPath)) {
  app.use(express.static(clientDistPath));

  // React Router fallback for frontend routes
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api/')) {
      return next();
    }

    res.sendFile(path.join(clientDistPath, 'index.html'));
  });
}

// API 404 handler
app.use('/api', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Endpoint ${req.originalUrl} not found.`,
    code: 'NOT_FOUND'
  });
});

// General 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Page ${req.originalUrl} not found.`,
    code: 'NOT_FOUND'
  });
});

// Global error handler
app.use(errorHandler);

module.exports = app;