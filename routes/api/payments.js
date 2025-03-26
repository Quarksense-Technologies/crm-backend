const express = require('express');
const { check } = require('express-validator');
const {
  getPayments,
  getPayment,
  getCompanyPayments,
  getProjectPayments,
  createPayment,
  updatePayment,
  deletePayment
} = require('../../controllers/paymentController');

const { protect, authorize } = require('../../middlewares/auth');

const router = express.Router();

// Apply protection to all routes
router.use(protect);

// Get payments for a company
router.get('/company/:companyId', getCompanyPayments);

// Get payments for a project
router.get('/project/:projectId', getProjectPayments);

// Routes with validation
router.route('/')
  .get(getPayments)
  .post(
    [
      check('amount', 'Amount is required').isNumeric(),
      check('receivedFrom', 'Received from information is required').not().isEmpty(),
      check('project', 'Project ID is required').not().isEmpty(),
      check('paymentId', 'Payment ID is required').not().isEmpty()
    ],
    authorize('admin', 'accountant', 'manager'),
    createPayment
  );

router.route('/:id')
  .get(getPayment)
  .put(authorize('admin', 'accountant'), updatePayment)
  .delete(authorize('admin', 'accountant'), deletePayment);

module.exports = router;