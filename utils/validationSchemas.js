// utils/validationSchemas.js
const { check } = require('express-validator');

// Auth validation
const validateUserRegistration = [
  check('name', 'Name is required').not().isEmpty(),
  check('email', 'Please include a valid email').isEmail(),
  check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 }),
  check('role', 'Valid role is required')
    .optional()
    .isIn(['admin', 'manager', 'employee', 'accountant'])
];

const validateLogin = [
  check('email', 'Please include a valid email').isEmail(),
  check('password', 'Password is required').exists()
];

const validateUpdatePassword = [
  check('currentPassword', 'Current password is required').exists(),
  check('newPassword', 'Please enter a password with 6 or more characters').isLength({ min: 6 })
];

// Company validation
const validateCompany = [
  check('name', 'Company name is required').not().isEmpty(),
  check('registrationNumber', 'Registration number is required').not().isEmpty(),
  check('address', 'Address object is required').optional().isObject(),
  check('address.street', 'Street is required when address is provided')
    .optional()
    .custom((value, { req }) => {
      if (req.body.address && !value) {
        throw new Error('Street is required when address is provided');
      }
      return true;
    }),
  check('address.city', 'City is required when address is provided')
    .optional()
    .custom((value, { req }) => {
      if (req.body.address && !value) {
        throw new Error('City is required when address is provided');
      }
      return true;
    }),
  check('contact', 'Contact object is required').optional().isObject(),
  check('contact.phone', 'Phone is required when contact is provided')
    .optional()
    .custom((value, { req }) => {
      if (req.body.contact && !value) {
        throw new Error('Phone is required when contact is provided');
      }
      return true;
    })
];

// Project validation
const validateProject = [
  check('projectId', 'Project ID is required').not().isEmpty(),
  check('name', 'Project name is required').not().isEmpty(),
  check('company', 'Company ID is required').not().isEmpty().isMongoId(),
  check('startDate', 'Start date is required').not().isEmpty(),
  check('endDate', 'End date must be a valid date')
    .optional()
    .custom((value, { req }) => {
      if (value && new Date(value) < new Date(req.body.startDate)) {
        throw new Error('End date must be after start date');
      }
      return true;
    }),
  check('status', 'Status must be active, pending, or completed')
    .optional()
    .isIn(['active', 'pending', 'completed'])
];

// Expense validation
const validateExpense = [
  check('expenseId', 'Expense ID is required').not().isEmpty(),
  check('date', 'Date must be a valid date').optional().isDate(),
  check('amount', 'Amount is required and must be a number').isNumeric(),
  check('description', 'Description is required').not().isEmpty(),
  check('category', 'Category must be a valid category type')
    .optional()
    .isIn(['office', 'travel', 'supplies', 'equipment', 'salary', 'misc']),
  check('project', 'Project ID is required').not().isEmpty().isMongoId()
];

// Payment validation
const validatePayment = [
  check('paymentId', 'Payment ID is required').not().isEmpty(),
  check('date', 'Date must be a valid date').optional().isDate(),
  check('amount', 'Amount is required and must be a number').isNumeric(),
  check('receivedFrom', 'Received from information is required').not().isEmpty(),
  check('project', 'Project ID is required').not().isEmpty().isMongoId()
];

// Manpower validation
const validateManpower = [
  check('name', 'Name is required').not().isEmpty(),
  check('role', 'Role is required').not().isEmpty(),
  check('hoursWorked', 'Hours worked is required and must be a number').isNumeric(),
  check('wageRate', 'Wage rate is required and must be a number').isNumeric(),
  check('startDate', 'Start date is required').not().isEmpty(),
  check('endDate', 'End date must be a valid date')
    .optional()
    .custom((value, { req }) => {
      if (value && new Date(value) < new Date(req.body.startDate)) {
        throw new Error('End date must be after start date');
      }
      return true;
    }),
  check('project', 'Project ID is required').not().isEmpty().isMongoId()
];

module.exports = {
  validateUserRegistration,
  validateLogin,
  validateUpdatePassword,
  validateCompany,
  validateProject,
  validateExpense,
  validatePayment,
  validateManpower
};