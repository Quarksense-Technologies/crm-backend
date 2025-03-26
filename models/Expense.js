const mongoose = require('mongoose');

const ExpenseSchema = new mongoose.Schema({
  expenseId: {
    type: String,
    required: [true, 'Please add an expense ID'],
    unique: true,
    trim: true
  },
  date: {
    type: Date,
    required: [true, 'Please add a date'],
    default: Date.now
  },
  amount: {
    type: Number,
    required: [true, 'Please add an amount']
  },
  description: {
    type: String,
    required: [true, 'Please add a description'],
    maxlength: [200, 'Description cannot be more than 200 characters']
  },
  category: {
    type: String,
    enum: ['office', 'travel', 'supplies', 'equipment', 'salary', 'misc'],
    default: 'misc'
  },
  referenceId: {
    type: String,
    trim: true
  },
  project: {
    type: mongoose.Schema.ObjectId,
    ref: 'Project',
    required: true
  },
  company: {
    type: mongoose.Schema.ObjectId,
    ref: 'Company',
    required: true
  },
  createdBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Expense', ExpenseSchema);