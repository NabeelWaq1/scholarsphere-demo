require('dotenv').config();
const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const scholarshipsRoutes = require('./routes/scholarships');
const mentorsRoutes = require('./routes/mentors');
const bookingsRoutes = require('./routes/bookings');
const liveSessionsRoutes = require('./routes/liveSessions');
const paymentsRoutes = require('./routes/payments');
const notificationsRoutes = require('./routes/notifications');
const studentsRoutes = require('./routes/students');
const statsRoutes = require('./routes/stats');
const connectionsRoutes = require('./routes/connections');
const serviceRequestsRoutes = require('./routes/serviceRequests');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware - allows requests from any origin by default, or specific FRONTEND_URL if provided
const allowedOrigin = process.env.FRONTEND_URL || '*';
app.use(cors({
  origin: allowedOrigin,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Request logging in dev
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/scholarships', scholarshipsRoutes);
app.use('/api/mentors', mentorsRoutes);
app.use('/api/bookings', bookingsRoutes);
app.use('/api/live-sessions', liveSessionsRoutes);
app.use('/api/payments', paymentsRoutes);
app.use('/api/notifications', notificationsRoutes);
app.use('/api/students', studentsRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/connections', connectionsRoutes);
app.use('/api/service-requests', serviceRequestsRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'ScholarSphere API',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled server error:', err);
  res.status(500).json({ error: 'Internal server error', details: err.message });
});

app.listen(PORT, () => {
  console.log(`🚀 ScholarSphere backend server running on http://localhost:${PORT}`);
});
