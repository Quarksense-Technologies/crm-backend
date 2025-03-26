const express = require('express');
const { check } = require('express-validator');
const {
  getCompanies,
  getCompany,
  createCompany,
  updateCompany,
  deleteCompany
} = require('../../controllers/companyController');

const { protect, authorize } = require('../../middlewares/auth');

const router = express.Router();

// Apply protection to all routes
router.use(protect);

// Routes with validation
router.route('/')
  .get(getCompanies)
  .post(
    [
      check('name', 'Company name is required').not().isEmpty(),
      check('registrationNumber', 'Registration number is required').not().isEmpty()
    ],
    authorize('admin', 'manager'),
    createCompany
  );

router.route('/:id')
  .get(getCompany)
  .put(authorize('admin', 'manager'), updateCompany)
  .delete(authorize('admin'), deleteCompany);

module.exports = router;