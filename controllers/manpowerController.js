const Manpower = require('../models/Manpower');
const Project = require('../models/Project');
const Company = require('../models/Company');
const { validationResult } = require('express-validator');

// @desc    Get all manpower
// @route   GET /api/manpower
// @access  Private
exports.getAllManpower = async (req, res) => {
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
    query = Manpower.find(JSON.parse(queryStr))
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
      query = query.sort('-createdAt');
    }

    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 25;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await Manpower.countDocuments(JSON.parse(queryStr));

    query = query.skip(startIndex).limit(limit);

    // Executing query
    const manpowers = await query;

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
      count: manpowers.length,
      pagination,
      data: manpowers
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server error' });
  }
};

// @desc    Get manpower for a company
// @route   GET /api/manpower/company/:companyId
// @access  Private
exports.getCompanyManpower = async (req, res) => {
  try {
    const company = await Company.findById(req.params.companyId);

    if (!company) {
      return res.status(404).json({ error: 'Company not found' });
    }

    const manpower = await Manpower.find({ company: req.params.companyId })
      .populate({
        path: 'project',
        select: 'name projectId'
      });

    res.json({
      success: true,
      count: manpower.length,
      data: manpower
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

// @desc    Get manpower for a project
// @route   GET /api/manpower/project/:projectId
// @access  Private
exports.getProjectManpower = async (req, res) => {
  try {
    const project = await Project.findById(req.params.projectId);

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    const manpower = await Manpower.find({ project: req.params.projectId })
      .populate({
        path: 'company',
        select: 'name'
      });

    res.json({
      success: true,
      count: manpower.length,
      data: manpower
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

// @desc    Get single manpower
// @route   GET /api/manpower/:id
// @access  Private
exports.getManpower = async (req, res) => {
  try {
    const manpower = await Manpower.findById(req.params.id)
      .populate({
        path: 'project',
        select: 'name projectId'
      })
      .populate({
        path: 'company',
        select: 'name'
      });

    if (!manpower) {
      return res.status(404).json({ error: 'Manpower not found' });
    }

    res.json({
      success: true,
      data: manpower
    });
  } catch (err) {
    console.error(err.message);
    
    // Handle invalid ObjectId
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ error: 'Manpower not found' });
    }
    
    res.status(500).json({ error: 'Server error' });
  }
};

// @desc    Create new manpower
// @route   POST /api/manpower
// @access  Private
exports.createManpower = async (req, res) => {
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

    // Calculate totalPayable if not provided
    if (!req.body.totalPayable) {
      req.body.totalPayable = req.body.hoursWorked * req.body.wageRate;
    }

    const manpower = await Manpower.create(req.body);

    res.status(201).json({
      success: true,
      data: manpower
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server error' });
  }
};

// @desc    Update manpower
// @route   PUT /api/manpower/:id
// @access  Private
exports.updateManpower = async (req, res) => {
  try {
    let manpower = await Manpower.findById(req.params.id);

    if (!manpower) {
      return res.status(404).json({ error: 'Manpower not found' });
    }

    // Make sure user is authorized to update the manpower
    // Only admin, manager or the creator can update
    if (
      manpower.createdBy.toString() !== req.user.id &&
      req.user.role !== 'admin' &&
      req.user.role !== 'manager'
    ) {
      return res.status(401).json({ error: 'Not authorized to update this manpower' });
    }

    // Don't allow changing the project or company
    delete req.body.project;
    delete req.body.company;

    // Calculate totalPayable if hours or wage rate is updated
    if (req.body.hoursWorked || req.body.wageRate) {
      const hours = req.body.hoursWorked || manpower.hoursWorked;
      const rate = req.body.wageRate || manpower.wageRate;
      req.body.totalPayable = hours * rate;
    }

    manpower = await Manpower.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.json({
      success: true,
      data: manpower
    });
  } catch (err) {
    console.error(err.message);
    
    // Handle invalid ObjectId
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ error: 'Manpower not found' });
    }
    
    res.status(500).json({ error: 'Server error' });
  }
};

// @desc    Delete manpower
// @route   DELETE /api/manpower/:id
// @access  Private
exports.deleteManpower = async (req, res) => {
  try {
    const manpower = await Manpower.findById(req.params.id);

    if (!manpower) {
      return res.status(404).json({ error: 'Manpower not found' });
    }

    // Make sure user is authorized to delete the manpower
    // Only admin, manager or the creator can delete
    if (
      manpower.createdBy.toString() !== req.user.id &&
      req.user.role !== 'admin' &&
      req.user.role !== 'manager'
    ) {
      return res.status(401).json({ error: 'Not authorized to delete this manpower' });
    }

    await manpower.remove();

    res.json({
      success: true,
      data: {}
    });
  } catch (err) {
    console.error(err.message);
    
    // Handle invalid ObjectId
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ error: 'Manpower not found' });
    }
    
    res.status(500).json({ error: 'Server error' });
  }
};