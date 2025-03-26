const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
  projectId: {
    type: String,
    required: [true, 'Please add a project ID'],
    unique: true,
    trim: true
  },
  name: {
    type: String,
    required: [true, 'Please add a project name'],
    trim: true,
    maxlength: [100, 'Project name cannot be more than 100 characters']
  },
  description: {
    type: String,
    maxlength: [500, 'Description cannot be more than 500 characters']
  },
  startDate: {
    type: Date,
    required: [true, 'Please add a start date']
  },
  endDate: {
    type: Date
  },
  status: {
    type: String,
    enum: ['active', 'pending', 'completed'],
    default: 'pending'
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
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Cascade delete expenses, payments, and manpower when a project is deleted
ProjectSchema.pre('remove', async function(next) {
  await this.model('Expense').deleteMany({ project: this._id });
  await this.model('Payment').deleteMany({ project: this._id });
  await this.model('Manpower').deleteMany({ project: this._id });
  next();
});

// Reverse populate with virtuals
ProjectSchema.virtual('expenses', {
  ref: 'Expense',
  localField: '_id',
  foreignField: 'project',
  justOne: false
});

ProjectSchema.virtual('payments', {
  ref: 'Payment',
  localField: '_id',
  foreignField: 'project',
  justOne: false
});

ProjectSchema.virtual('manpower', {
  ref: 'Manpower',
  localField: '_id',
  foreignField: 'project',
  justOne: false
});

module.exports = mongoose.model('Project', ProjectSchema);