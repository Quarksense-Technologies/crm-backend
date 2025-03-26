const Expense = require('../models/Expense');
const Project = require('../models/Project');
const Company = require('../models/Company');
const { validationResult } = require('express-validator');

// @desc    Get all expenses
// @route   GET /api/expenses
// @access  Private
exports.getExpenses = async (req, res) => {
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
    query = Expense.find(JSON.parse(queryStr))
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
    const total = await Expense.countDocuments(JSON.parse(queryStr));

    query = query.skip(startIndex).limit(limit);

    // Executing query
    const expenses = await query;

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
      count: expenses.length,
      pagination,
      data: expenses
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server error' });
  }
};

// @desc    Get expenses for a company
// @route   GET /api/expenses/company/:companyId
// @access  Private
exports.getCompanyExpenses = async (req, res) => {
  try {
    const company = await Company.findById(req.params.companyId);

    if (!company) {
      return res.status(404).json({ error: 'Company not found' });
    }

    const expenses = await Expense.find({ company: req.params.companyId })
      .populate({
        path: 'project',
        select: 'name projectId'
      });

    res.json({
      success: true,
      count: expenses.length,
      data: expenses
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

// @desc    Get expenses for a project
// @route   GET /api/expenses/project/:projectId
// @access  Private
exports.getProjectExpenses = async (req, res) => {
  try {
    const project = await Project.findById(req.params.projectId);

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    const expenses = await Expense.find({ project: req.params.projectId })
      .populate({
        path: 'company',
        select: 'name'
      });

    res.json({
      success: true,
      count: expenses.length,
      data: expenses
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

// @desc    Get single expense
// @route   GET /api/expenses/:id
// @access  Private
exports.getExpense = async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id)
      .populate({
        path: 'project',
        select: 'name projectId'
      })
      .populate({
        path: 'company',
        select: 'name'
      });

    if (!expense) {
      return res.status(404).json({ error: 'Expense not found' });
    }

    res.json({
      success: true,
      data: expense
    });
  } catch (err) {
    console.error(err.message);
    
    // Handle invalid ObjectId
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ error: 'Expense not found' });
    }
    
    res.status(500).json({ error: 'Server error' });
  }
};

// @desc    Create new expense
// @route   POST /api/expenses
// @access  Private
exports.createExpense = async (req, res) => {
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

    // Check for existing expense with same expenseId
    if (req.body.expenseId) {
      const existingExpense = await Expense.findOne({ expenseId: req.body.expenseId });

      if (existingExpense) {
        return res.status(400).json({ error: 'Expense with this ID already exists' });
      }
    }

    const expense = await Expense.create(req.body);

    res.status(201).json({
      success: true,
      data: expense
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server error' });
  }
};

// @desc    Update expense
// @route   PUT /api/expenses/:id
// @access  Private
exports.updateExpense = async (req, res) => {
  try {
    let expense = await Expense.findById(req.params.id);

    if (!expense) {
      return res.status(404).json({ error: 'Expense not found' });
    }

    // Make sure user is authorized to update the expense
    // Only admin, accountant or the creator can update
    if (
      expense.createdBy.toString() !== req.user.id &&
      req.user.role !== 'admin' &&
      req.user.role !== 'accountant'
    ) {
      return res.status(401).json({ error: 'Not authorized to update this expense' });
    }

    // Don't allow changing the project or company
    delete req.body.project;
    delete req.body.company;

    expense = await Expense.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.json({
      success: true,
      data: expense
    });
  } catch (err) {
    console.error(err.message);
    
    // Handle invalid ObjectId
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ error: 'Expense not found' });
    }
    
    res.status(500).json({ error: 'Server error' });
  }
};

// @desc    Delete expense
// @route   DELETE /api/expenses/:id
// @access  Private
exports.deleteExpense = async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);

    if (!expense) {
      return res.status(404).json({ error: 'Expense not found' });
    }

    // Make sure user is authorized to delete the expense
    // Only admin, accountant or the creator can delete
    if (
      expense.createdBy.toString() !== req.user.id &&
      req.user.role !== 'admin' &&
      req.user.role !== 'accountant'
    ) {
      return res.status(401).json({ error: 'Not authorized to delete this expense' });
    }

    await expense.remove();

    res.json({
      success: true,
      data: {}
    });
  } catch (err) {
    console.error(err.message);
    
    // Handle invalid ObjectId
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ error: 'Expense not found' });
    }
    
    res.status(500).json({ error: 'Server error' });
  }
};