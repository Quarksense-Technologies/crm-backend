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