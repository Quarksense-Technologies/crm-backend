const mongoose = require('mongoose');

const CompanySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a company name'],
    trim: true,
    maxlength: [100, 'Company name cannot be more than 100 characters']
  },
  registrationNumber: {
    type: String,
    required: [true, 'Please add a registration number'],
    unique: true,
    trim: true
  },
  address: {
    street: String,
    city: String,
    state: String,
    zip: String,
    country: String
  },
  contact: {
    phone: String,
    email: String,
    website: String
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

// Cascade delete projects when a company is deleted
CompanySchema.pre('remove', async function(next) {
  await this.model('Project').deleteMany({ company: this._id });
  next();
});

// Reverse populate with virtuals
CompanySchema.virtual('projects', {
  ref: 'Project',
  localField: '_id',
  foreignField: 'company',
  justOne: false
});

module.exports = mongoose.model('Company', CompanySchema);