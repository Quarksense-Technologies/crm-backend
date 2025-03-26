const mongoose = require('mongoose');
const dotenv = require('dotenv');
const config = require('config');
const bcrypt = require('bcryptjs');

// Load env vars
dotenv.config();

// Load models
const User = require('./models/User');
const Company = require('./models/Company');
const Project = require('./models/Project');
const Expense = require('./models/Expense');
const Payment = require('./models/Payment');
const Manpower = require('./models/Manpower');

// Connect to DB
mongoose.connect(process.env.MONGO_URI || config.get('database.uri'), {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Create seed data
const createSeedData = async () => {
  try {
    // Create admin user
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('admin123', salt);
    
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@example.com',
      password: hashedPassword,
      role: 'admin'
    });
    
    console.log('Admin user created:', admin.email);
    
    // Create manager user
    const managerPassword = await bcrypt.hash('manager123', salt);
    const manager = await User.create({
      name: 'Manager User',
      email: 'manager@example.com',
      password: managerPassword,
      role: 'manager'
    });
    
    console.log('Manager user created:', manager.email);
    
    // Create accountant user
    const accountantPassword = await bcrypt.hash('accountant123', salt);
    const accountant = await User.create({
      name: 'Accountant User',
      email: 'accountant@example.com',
      password: accountantPassword,
      role: 'accountant'
    });
    
    console.log('Accountant user created:', accountant.email);
    
    // Create sample company
    const company = await Company.create({
      name: 'Sample Company, Inc.',
      registrationNumber: 'SAMP12345',
      address: {
        street: '123 Main Street',
        city: 'Sample City',
        state: 'Sample State',
        zip: '12345',
        country: 'Sample Country'
      },
      contact: {
        phone: '123-456-7890',
        email: 'contact@samplecompany.com',
        website: 'www.samplecompany.com'
      },
      createdBy: admin._id
    });
    
    console.log('Sample company created:', company.name);
    
    // Create sample project
    const project = await Project.create({
      projectId: 'PROJ12345',
      name: 'Sample Project',
      description: 'This is a sample project for demonstration purposes.',
      startDate: new Date('2023-01-01'),
      endDate: new Date('2023-12-31'),
      status: 'active',
      company: company._id,
      createdBy: admin._id
    });
    
    console.log('Sample project created:', project.name);
    
    // Create sample expenses
    const expenses = await Expense.insertMany([
      {
        expenseId: 'EXP12345',
        date: new Date('2023-01-15'),
        amount: 1500,
        description: 'Office supplies',
        category: 'office',
        referenceId: 'INV12345',
        project: project._id,
        company: company._id,
        createdBy: accountant._id
      },
      {
        expenseId: 'EXP12346',
        date: new Date('2023-02-01'),
        amount: 2500,
        description: 'Equipment purchase',
        category: 'equipment',
        referenceId: 'INV12346',
        project: project._id,
        company: company._id,
        createdBy: accountant._id
      },
      {
        expenseId: 'EXP12347',
        date: new Date('2023-02-15'),
        amount: 1000,
        description: 'Travel expenses',
        category: 'travel',
        referenceId: 'INV12347',
        project: project._id,
        company: company._id,
        createdBy: accountant._id
      }
    ]);
    
    console.log(`${expenses.length} sample expenses created`);
    
    // Create sample payments
    const payments = await Payment.insertMany([
      {
        paymentId: 'PAY12345',
        date: new Date('2023-01-20'),
        amount: 5000,
        receivedFrom: 'Client A',
        reference: 'INV54321',
        description: 'Initial payment',
        project: project._id,
        company: company._id,
        createdBy: accountant._id
      },
      {
        paymentId: 'PAY12346',
        date: new Date('2023-02-20'),
        amount: 7500,
        receivedFrom: 'Client A',
        reference: 'INV54322',
        description: 'Milestone payment',
        project: project._id,
        company: company._id,
        createdBy: accountant._id
      }
    ]);
    
    console.log(`${payments.length} sample payments created`);
    
    // Create sample manpower
    const manpower = await Manpower.insertMany([
      {
        name: 'John Doe',
        role: 'Developer',
        hoursWorked: 160,
        wageRate: 25,
        totalPayable: 4000,
        startDate: new Date('2023-01-01'),
        endDate: new Date('2023-01-31'),
        project: project._id,
        company: company._id,
        createdBy: manager._id
      },
      {
        name: 'Jane Smith',
        role: 'Designer',
        hoursWorked: 120,
        wageRate: 30,
        totalPayable: 3600,
        startDate: new Date('2023-01-01'),
        endDate: new Date('2023-01-31'),
        project: project._id,
        company: company._id,
        createdBy: manager._id
      }
    ]);
    
    console.log(`${manpower.length} sample manpower entries created`);
    
    console.log('Seed data created successfully!');
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

// Delete existing data
const deleteData = async () => {
  try {
    await User.deleteMany();
    await Company.deleteMany();
    await Project.deleteMany();
    await Expense.deleteMany();
    await Payment.deleteMany();
    await Manpower.deleteMany();
    
    console.log('All data deleted!');
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

// CLI command to either import or delete data
if (process.argv[2] === '-i') {
  createSeedData();
} else if (process.argv[2] === '-d') {
  deleteData();
} else {
  console.log(`
    Usage:
    node seeder.js -i  # Import seed data
    node seeder.js -d  # Delete all data
  `);
  process.exit();
}