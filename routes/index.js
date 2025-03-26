const express = require('express');
const router = express.Router();

// Import all route modules
const authRoutes = require('./api/auth');
const companyRoutes = require('./api/companies');
const projectRoutes = require('./api/projects');
const expenseRoutes = require('./api/expenses');
const paymentRoutes = require('./api/payments');
const manpowerRoutes = require('./api/manpower');

// Mount the routes
router.use('/auth', authRoutes);
router.use('/companies', companyRoutes);
router.use('/projects', projectRoutes);
router.use('/expenses', expenseRoutes);
router.use('/payments', paymentRoutes);
router.use('/manpower', manpowerRoutes);

// Health check route
router.get('/', (req, res) => {
  res.json({
    message: 'S-Gen CRM API is running',
    version: '1.0.0',
    status: 'healthy'
  });
});

module.exports = router;