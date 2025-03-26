const Payment = require('../models/Payment');
const Project = require('../models/Project');
const Company = require('../models/Company');
const { validationResult } = require('express-validator');

// @desc    Get all payments
// @route   GET /api/payments
// @access  Private
exports.getPayments = async (req, res) => {
  try {
    let query;

    // Copy req.query
    const reqQuery = { ...req.query };

    // Fields to exclude
    const removeFields = ['select', 'sort', 'page', 'limit'];

    // Loop over removeFields and delete them from reqQuery
    removeFields.forEach(param => delete reqQuery[param]);

    // Create query string
    let queryStr = JSON.stringify(reqQuery);

    // Create operators ($gt, $gte, etc)
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

    // Finding resource
    query = Payment.find(JSON.parse(queryStr))
      .populate({
        path: 'project',
        select: 'name projectId'
      })
      .populate({
        path: 'company',
        select: 'name'
      });

    // Select Fields
    if (req.query.select) {
      const fields = req.query.select.split(',').join(' ');
      query = query.select(fields);
    }

    // Sort
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      query = query.sort(sortBy);
    } else {
      query = query.sort('-date');
    }

    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 25;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await Payment.countDocuments(JSON.parse(queryStr));

    query = query.skip(startIndex).limit(limit);

    // Executing query
    const payments = await query;

    // Pagination result
    const pagination = {};

    if (endIndex < total) {
      pagination.next = {
        page: page + 1,
        limit
      };
    }

    if (startIndex > 0) {
      pagination.prev = {
        page: page - 1,
        limit
      };
    }

    res.json({
      success: true,
      count: payments.length,
      pagination,
      data: payments
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server error' });
  }
};

// @desc    Get payments for a company
// @route   GET /api/payments/company/:companyId
// @access  Private
exports.getCompanyPayments = async (req, res) => {
  try {
    const company = await Company.findById(req.params.companyId);

    if (!company) {
      return res.status(404).json({ error: 'Company not found' });
    }

    const payments = await Payment.find({ company: req.params.companyId })
      .populate({
        path: 'project',
        select: 'name projectId'
      });

    res.json({
      success: true,
      count: payments.length,
      data: payments
    });
  } catch (err) {
    console.error(err.message);
    
    // Handle invalid ObjectId
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ error: 'Company not found' });
    }
    
    res.status(500).json({ error: 'Server error' });
  }
};

// @desc    Get payments for a project
// @route   GET /api/payments/project/:projectId
// @access  Private
exports.getProjectPayments = async (req, res) => {
  try {
    const project = await Project.findById(req.params.projectId);

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    const payments = await Payment.find({ project: req.params.projectId })
      .populate({
        path: 'company',
        select: 'name'
      });

    res.json({
      success: true,
      count: payments.length,
      data: payments
    });
  } catch (err) {
    console.error(err.message);
    
    // Handle invalid ObjectId
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ error: 'Project not found' });
    }
    
    res.status(500).json({ error: 'Server error' });
  }
};

// @desc    Get single payment
// @route   GET /api/payments/:id
// @access  Private
exports.getPayment = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id)
      .populate({
        path: 'project',
        select: 'name projectId'
      })
      .populate({
        path: 'company',
        select: 'name'
      });

    if (!payment) {
      return res.status(404).json({ error: 'Payment not found' });
    }

    res.json({
      success: true,
      data: payment
    });
  } catch (err) {
    console.error(err.message);
    
    // Handle invalid ObjectId
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ error: 'Payment not found' });
    }
    
    res.status(500).json({ error: 'Server error' });
  }
};

// @desc    Create new payment
// @route   POST /api/payments
// @access  Private
exports.createPayment = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    // Check if project exists
    const project = await Project.findById(req.body.project);

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    // Add company and user to req.body
    req.body.company = project.company;
    req.body.createdBy = req.user.id;

    // Check for existing payment with same paymentId
    if (req.body.paymentId) {
      const existingPayment = await Payment.findOne({ paymentId: req.body.paymentId });

      if (existingPayment) {
        return res.status(400).json({ error: 'Payment with this ID already exists' });
      }
    }

    const payment = await Payment.create(req.body);

    res.status(201).json({
      success: true,
      data: payment
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server error' });
  }
};

// @desc    Update payment
// @route   PUT /api/payments/:id
// @access  Private
exports.updatePayment = async (req, res) => {
  try {
    let payment = await Payment.findById(req.params.id);

    if (!payment) {
      return res.status(404).json({ error: 'Payment not found' });
    }

    // Make sure user is authorized to update the payment
    // Only admin, accountant or the creator can update
    if (
      payment.createdBy.toString() !== req.user.id &&
      req.user.role !== 'admin' &&
      req.user.role !== 'accountant'
    ) {
      return res.status(401).json({ error: 'Not authorized to update this payment' });
    }

    // Don't allow changing the project or company
    delete req.body.project;
    delete req.body.company;

    payment = await Payment.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.json({
      success: true,
      data: payment
    });
  } catch (err) {
    console.error(err.message);
    
    // Handle invalid ObjectId
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ error: 'Payment not found' });
    }
    
    res.status(500).json({ error: 'Server error' });
  }
};

// @desc    Delete payment
// @route   DELETE /api/payments/:id
// @access  Private
exports.deletePayment = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id);

    if (!payment) {
      return res.status(404).json({ error: 'Payment not found' });
    }

    // Make sure user is authorized to delete the payment
    // Only admin, accountant or the creator can delete
    if (
      payment.createdBy.toString() !== req.user.id &&
      req.user.role !== 'admin' &&
      req.user.role !== 'accountant'
    ) {
      return res.status(401).json({ error: 'Not authorized to delete this payment' });
    }

    await payment.remove();

    res.json({
      success: true,
      data: {}
    });
  } catch (err) {
    console.error(err.message);
    
    // Handle invalid ObjectId
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ error: 'Payment not found' });
    }
    
    res.status(500).json({ error: 'Server error' });
  }
};