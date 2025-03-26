const express = require('express');
const { check } = require('express-validator');
const {
  getExpenses,
  getExpense,
  getCompanyExpenses,
  getProjectExpenses,
  createExpense,
  updateExpense,
  deleteExpense
} = require('../../controllers/expenseController');

const { protect, authorize } = require('../../middlewares/auth');

const router = express.Router();

// Apply protection to all routes
router.use(protect);

// Get expenses for a company
router.get('/company/:companyId', getCompanyExpenses);

// Get expenses for a project
router.get('/project/:projectId', getProjectExpenses);

// Routes with validation
router.route('/')
  .get(getExpenses)
  .post(
    [
      check('amount', 'Amount is required').isNumeric(),
      check('description', 'Description is required').not().isEmpty(),
      check('project', 'Project ID is required').not().isEmpty(),
      check('expenseId', 'Expense ID is required').not().isEmpty()
    ],
    authorize('admin', 'accountant', 'manager'),
    createExpense
  );

router.route('/:id')
  .get(getExpense)
  .put(authorize('admin', 'accountant'), updateExpense)
  .delete(authorize('admin', 'accountant'), deleteExpense);

module.exports = router;