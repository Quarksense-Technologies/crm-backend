const express = require('express');
const { check } = require('express-validator');
const {
  getProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject
} = require('../../controllers/projectController');

const { protect, authorize } = require('../../middlewares/auth');

const router = express.Router();

// Apply protection to all routes
router.use(protect);

// Routes with validation
router.route('/')
  .get(getProjects)
  .post(
    [
      check('projectId', 'Project ID is required').not().isEmpty(),
      check('name', 'Project name is required').not().isEmpty(),
      check('company', 'Company ID is required').not().isEmpty(),
      check('startDate', 'Start date is required').not().isEmpty()
    ],
    authorize('admin', 'manager'),
    createProject
  );

router.route('/:id')
  .get(getProject)
  .put(authorize('admin', 'manager'), updateProject)
  .delete(authorize('admin'), deleteProject);

module.exports = router;