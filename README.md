# S-Gen CRM & Project Management System - Backend API

A comprehensive backend API for project management, CRM, inventory, accounting, and reporting that enables companies to efficiently manage their projects, clients, finances, expenses, payments, manpower, and materials.

## ✨ Features

- **Authentication & Authorization**: JWT-based authentication with role-based access control
- **User Management**: Admin, Owner, Supervisor, Accountant, and Employee roles
- **Company Management**: Track clients, vendors, and partners
- **Project Management**: Handle projects from creation to completion with milestones tracking
- **Financial Management**:
  - Expense tracking with categories and approval workflows
  - Payment management
  - Invoice generation
  - Receivables tracking with aging reports
- **Resource Management**:
  - Manpower allocation and cost tracking
  - Materials procurement and inventory management
  - Returnable materials tracking
  - Subcontractor management
- **Reporting & Analytics**:
  - Dashboard overview
  - Financial reports (Profit & Loss, Monthly)
  - Project performance reports
  - Resource utilization reports
  - Expense analysis

## 🧰 Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Validation**: Express Validator
- **Security**: Helmet, CORS, Rate Limiting
- **Logging**: Morgan
- **Containerization**: Docker & Docker Compose
- **Documentation**: Swagger/OpenAPI (optional)

## 🛠️ Installation & Setup

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- npm or yarn
- Git

### Local Development Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/s-gen-backend.git
   cd s-gen-backend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   # OR
   yarn install
   ```

3. **Configure environment variables**:
   Create a `.env` file in the root directory and add the following variables:
   ```
   NODE_ENV=development
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/s-gen-db
   JWT_SECRET=your_secure_jwt_secret_key
   JWT_EXPIRE=30d
   
   # Optional Email configuration
   EMAIL_HOST=smtp.example.com
   EMAIL_PORT=587
   EMAIL_USER=noreply@example.com
   EMAIL_PASSWORD=your_secure_email_password
   ```

4. **Start the development server**:
   ```bash
   npm run dev
   # OR
   yarn dev
   ```

5. **Access the API**:
   The API will be available at `http://localhost:5000`

### Docker Setup

1. **Build and run using Docker Compose**:
   ```bash
   docker-compose up -d
   ```

2. **Access the API**:
   The API will be available at `http://localhost:5000`

## 📐 Project Structure

```
s-gen-backend/
├── config/             # Configuration files
├── controllers/        # Route controllers
├── middleware/         # Custom middleware
├── models/             # Mongoose models
├── routes/             # API routes
├── utils/              # Utility functions
├── .env                # Environment variables
├── .gitignore          # Git ignore file
├── docker-compose.yml  # Docker compose config
├── Dockerfile          # Docker config
├── package.json        # Project dependencies
├── server.js           # Main application entry point
└── README.md           # Project documentation
```

## 🚀 API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login & get JWT token
- `GET /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/updatedetails` - Update user details
- `PUT /api/auth/updatepassword` - Update password
- `POST /api/auth/forgotpassword` - Forgot password
- `PUT /api/auth/resetpassword/:resettoken` - Reset password

### Users
- `GET /api/users` - Get all users (admin only)
- `GET /api/users/:id` - Get single user
- `POST /api/users` - Create user (admin only)
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### Companies
- `GET /api/companies` - Get all companies
- `POST /api/companies` - Create new company
- `GET /api/companies/:id` - Get company details
- `PUT /api/companies/:id` - Update company
- `DELETE /api/companies/:id` - Delete company

### Projects
- `GET /api/projects` - Get all projects
- `POST /api/projects` - Create new project
- `GET /api/projects/:id` - Get project details
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project
- `POST /api/projects/:id/team` - Add team member
- `DELETE /api/projects/:id/team/:userId` - Remove team member
- `POST /api/projects/:id/milestones` - Add milestone
- `PUT /api/projects/:id/milestones/:milestoneId` - Update milestone
- `DELETE /api/projects/:id/milestones/:milestoneId` - Delete milestone
- `GET /api/projects/:id/financial` - Get project financial summary
- `GET /api/projects/client/:clientId` - Get client projects

### Expenses & Categories
- `GET /api/expenses` - Get all expenses
- `POST /api/expenses` - Create new expense
- `GET /api/expenses/:id` - Get expense details
- `PUT /api/expenses/:id` - Update expense
- `DELETE /api/expenses/:id` - Delete expense
- `PUT /api/expenses/:id/approve` - Approve expense
- `PUT /api/expenses/:id/reject` - Reject expense
- `GET /api/expenses/project/:projectId` - Get project expenses
- `GET /api/expenses/summary/category` - Get expense summary by category
- `GET /api/expenses/summary/monthly` - Get monthly expense summary
- `GET /api/expenses/categories` - Get expense categories
- `POST /api/expenses/categories` - Create expense category
- `GET /api/expenses/categories/:id` - Get category details
- `PUT /api/expenses/categories/:id` - Update category
- `DELETE /api/expenses/categories/:id` - Delete category

### Payments
- `GET /api/payments` - Get all payments
- `POST /api/payments` - Create new payment
- `GET /api/payments/:id` - Get payment details
- `PUT /api/payments/:id` - Update payment
- `DELETE /api/payments/:id` - Delete payment
- `GET /api/payments/project/:projectId` - Get project payments
- `GET /api/payments/summary/monthly` - Get monthly payment summary
- `GET /api/payments/summary/project` - Get payment summary by project
- `GET /api/payments/summary/client` - Get payment summary by client

### Manpower
- `GET /api/manpower` - Get all manpower entries
- `POST /api/manpower` - Create new manpower entry
- `GET /api/manpower/:id` - Get manpower entry details
- `PUT /api/manpower/:id` - Update manpower entry
- `DELETE /api/manpower/:id` - Delete manpower entry
- `GET /api/manpower/project/:projectId` - Get project manpower
- `POST /api/manpower/:id/working-days` - Add working days
- `POST /api/manpower/:id/payments` - Add payment
- `GET /api/manpower/summary/project` - Get manpower summary by project
- `GET /api/manpower/summary/role` - Get manpower summary by role

### Materials & Inventory
- `GET /api/materials` - Get all materials
- `POST /api/materials` - Create new material
- `GET /api/materials/:id` - Get material details
- `PUT /api/materials/:id` - Update material
- `DELETE /api/materials/:id` - Delete material
- `GET /api/materials/categories` - Get material categories
- `POST /api/materials/categories` - Create material category

- `GET /api/inventory` - Get all inventory transactions
- `POST /api/inventory` - Create inventory transaction
- `GET /api/inventory/:id` - Get transaction details
- `PUT /api/inventory/:id` - Update transaction
- `DELETE /api/inventory/:id` - Delete transaction
- `GET /api/inventory/project/:projectId` - Get project inventory
- `GET /api/inventory/summary/material` - Get inventory summary by material
- `GET /api/inventory/returnable` - Get returnable materials

### Invoices & Receivables
- `GET /api/invoices` - Get all invoices
- `POST /api/invoices` - Create new invoice
- `GET /api/invoices/:id` - Get invoice details
- `PUT /api/invoices/:id` - Update invoice
- `DELETE /api/invoices/:id` - Delete invoice
- `PUT /api/invoices/:id/send` - Mark invoice as sent
- `PUT /api/invoices/:id/cancel` - Cancel invoice
- `GET /api/invoices/project/:projectId` - Get project invoices

- `GET /api/receivables` - Get all receivables
- `GET /api/receivables/:id` - Get receivable details
- `PUT /api/receivables/:id/bad-debt` - Mark as bad debt
- `POST /api/receivables/:id/reminder` - Send reminder
- `GET /api/receivables/aging` - Get receivable aging summary

### Subcontractors
- `GET /api/subcontractors` - Get all subcontractors
- `POST /api/subcontractors` - Create new subcontractor
- `GET /api/subcontractors/:id` - Get subcontractor details
- `PUT /api/subcontractors/:id` - Update subcontractor
- `DELETE /api/subcontractors/:id` - Delete subcontractor
- `POST /api/subcontractors/:id/projects` - Add project
- `DELETE /api/subcontractors/:id/projects/:projectId` - Remove project
- `POST /api/subcontractors/:id/ratings` - Add rating
- `GET /api/subcontractors/:id/payments` - Get payment history

- `GET /api/subcontractor-payments` - Get all subcontractor payments
- `POST /api/subcontractor-payments` - Create subcontractor payment
- `GET /api/subcontractor-payments/:id` - Get payment details
- `PUT /api/subcontractor-payments/:id` - Update payment
- `DELETE /api/subcontractor-payments/:id` - Delete payment

### Reports
- `GET /api/reports/dashboard` - Get dashboard overview
- `GET /api/reports/monthly/:year/:month` - Get monthly report
- `GET /api/reports/profit-loss` - Get profit & loss report
- `GET /api/reports/project-performance` - Get project performance report
- `GET /api/reports/resource-utilization` - Get resource utilization report
- `GET /api/reports/expenses` - Get expense report

## 🔒 Authentication

The API uses JWT for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

## 👥 Role-Based Access Control

- **Admin**: Full system access
- **Owner**: Company-wide access with some restrictions
- **Supervisor**: Project management capabilities
- **Accountant**: Financial management access
- **Employee**: Limited access to assigned projects

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage
```

## 📜 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -m 'Add your feature'`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Open a Pull Request

## 📞 Support

For support, email support@example.com or open an issue in the GitHub repository.