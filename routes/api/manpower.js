const express = require('express');
const { check } = require('express-validator');
const {
  getAllManpower,
  getManpower,
  getCompanyManpower,
  getProjectManpower,
  createManpower,
  updateManpower,
  deleteManpower
} = require('../../controllers/manpowerController');

const { protect, authorize } = require('../../middlewares/auth');

const router = express.Router();

// Apply protection to all routes
router.use(protect);

// Get manpower for a company
router.get('/company/:companyId', getCompanyManpower);

// Get manpower for a project
router.get('/project/:projectId', getProjectManpower);

// Routes with validation
router.route('/')
  .get(getAllManpower)
  .post(
    [
      check('name', 'Name is required').not().isEmpty(),
      check('role', 'Role is required').not().isEmpty(),
      check('hoursWorked', 'Hours worked is required').isNumeric(),
      check('wageRate', 'Wage rate is required').isNumeric(),
      check('project', 'Project ID is required').not().isEmpty(),
      check('startDate', 'Start date is required').not().isEmpty()
    ],
    authorize('admin', 'manager'),
    createManpower
  );

router.route('/:id')
  .get(getManpower)
  .put(authorize('admin', 'manager'), updateManpower)
  .delete(authorize('admin', 'manager'), deleteManpower);

module.exports = router;