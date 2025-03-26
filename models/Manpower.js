const mongoose = require('mongoose');

const ManpowerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name'],
    trim: true
  },
  role: {
    type: String,
    required: [true, 'Please add a role'],
    trim: true
  },
  hoursWorked: {
    type: Number,
    required: [true, 'Please add hours worked']
  },
  wageRate: {
    type: Number,
    required: [true, 'Please add wage rate']
  },
  totalPayable: {
    type: Number,
    required: [true, 'Please add total payable']
  },
  startDate: {
    type: Date,
    required: [true, 'Please add a start date']
  },
  endDate: {
    type: Date
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

// Calculate total payable before saving
ManpowerSchema.pre('save', function(next) {
  this.totalPayable = this.hoursWorked * this.wageRate;
  next();
});

module.exports = mongoose.model('Manpower', ManpowerSchema);