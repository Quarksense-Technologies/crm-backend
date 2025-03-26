const Company = require('../models/Company');
const { validationResult } = require('express-validator');

// @desc    Get all companies
// @route   GET /api/companies
// @access  Private
exports.getCompanies = async (req, res) => {
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
    query = Company.find(JSON.parse(queryStr));

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
    const total = await Company.countDocuments(JSON.parse(queryStr));

    query = query.skip(startIndex).limit(limit);

    // If populate parameter is present, populate related projects
    if (req.query.populate) {
      query = query.populate('projects');
    }

    // Executing query
    const companies = await query;

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
      count: companies.length,
      pagination,
      data: companies
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server error' });
  }
};

// @desc    Get single company
// @route   GET /api/companies/:id
// @access  Private
exports.getCompany = async (req, res) => {
  try {
    const company = await Company.findById(req.params.id).populate('projects');

    if (!company) {
      return res.status(404).json({ error: 'Company not found' });
    }

    res.json({
      success: true,
      data: company
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

// @desc    Create new company
// @route   POST /api/companies
// @access  Private
exports.createCompany = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    // Add user to req.body
    req.body.createdBy = req.user.id;

    // Check for existing company with same registration number
    const existingCompany = await Company.findOne({ registrationNumber: req.body.registrationNumber });

    if (existingCompany) {
      return res.status(400).json({ error: 'Company with this registration number already exists' });
    }

    const company = await Company.create(req.body);

    res.status(201).json({
      success: true,
      data: company
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server error' });
  }
};

// @desc    Update company
// @route   PUT /api/companies/:id
// @access  Private
exports.updateCompany = async (req, res) => {
  try {
    let company = await Company.findById(req.params.id);

    if (!company) {
      return res.status(404).json({ error: 'Company not found' });
    }

    // Make sure user is authorized to update the company
    // Only admin or the creator can update
    if (
      company.createdBy.toString() !== req.user.id &&
      req.user.role !== 'admin'
    ) {
      return res.status(401).json({ error: 'Not authorized to update this company' });
    }

    company = await Company.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.json({
      success: true,
      data: company
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

// @desc    Delete company
// @route   DELETE /api/companies/:id
// @access  Private
exports.deleteCompany = async (req, res) => {
  try {
    const company = await Company.findById(req.params.id);

    if (!company) {
      return res.status(404).json({ error: 'Company not found' });
    }

    // Make sure user is authorized to delete the company
    // Only admin or the creator can delete
    if (
      company.createdBy.toString() !== req.user.id &&
      req.user.role !== 'admin'
    ) {
      return res.status(401).json({ error: 'Not authorized to delete this company' });
    }

    await company.remove();

    res.json({
      success: true,
      data: {}
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