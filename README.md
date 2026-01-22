# HR Harmony - Complete HR Management System

A modern, full-featured Human Resources Management System built with React, TypeScript, and Node.js.

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- PostgreSQL database

### Installation

```bash
# Clone the repository
git clone <YOUR_GIT_URL>
cd hr-harmony

# Install frontend dependencies
npm install

# Install backend dependencies
cd backend
npm install
cd ..
```

### Running the Application

**Development Mode (Local):**
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
npm run dev
```

**Production Mode:**
```bash
# Terminal 1 - Backend
cd backend
npm run dev:prod

# Terminal 2 - Frontend
npm run dev:prod
```

The application will be available at:
- Frontend: `http://localhost:8080`
- Backend API: `http://localhost:3000`

## 🔧 Environment Configuration

### Backend Configuration

Create `.env.development` and `.env.production` files in the `backend` directory:

**`.env.development` (Local):**
```env
NODE_ENV=development
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=hrms_db
DB_USER=postgres
DB_PASSWORD=your_password
JWT_SECRET=your_jwt_secret_key_here
CORS_ORIGIN=http://localhost:8080
API_BASE_URL=http://localhost:3000
```

**`.env.production` (Production):**
```env
NODE_ENV=production
PORT=3000
DB_HOST=your_production_db_host
DB_PORT=5432
DB_NAME=railway
DB_USER=postgres
DB_PASSWORD=your_production_password
JWT_SECRET=your_production_jwt_secret
CORS_ORIGIN=https://your-frontend-url.com
API_BASE_URL=https://your-backend-url.com
```

### Frontend Configuration

Create `.env.development` and `.env.production` files in the root directory:

**`.env.development`:**
```env
VITE_API_URL=http://localhost:3000
```

**`.env.production`:**
```env
VITE_API_URL=https://your-backend-url.com
```

## 📱 Responsive Design

This application is **fully responsive** and optimized for all screen sizes:

### Supported Devices
- ✅ **Mobile** (320px+): Touch-optimized navigation, single-column layouts
- ✅ **Tablet** (640px+): 2-column grids, side-by-side filters
- ✅ **Desktop** (1024px+): Full sidebar, multi-column layouts

### Key Responsive Features
- Mobile-first design approach
- Hamburger menu navigation on mobile
- Adaptive grids and layouts (1 → 2 → 4 columns)
- Touch-friendly interactive elements (44x44px minimum)
- Responsive charts and tables
- Scrollable dialogs on mobile
- No horizontal scrolling on any device

### Responsive Breakpoints
```
xs:  480px  - Extra small devices
sm:  640px  - Small devices (tablets)
md:  768px  - Medium devices
lg:  1024px - Large devices (desktops)
xl:  1280px - Extra large devices
2xl: 1536px - 2X Extra large devices
```

## 🎯 Features

### Core Modules
- **Dashboard** - Real-time analytics and insights
- **Employee Management** - Complete employee lifecycle management
- **Attendance Tracking** - Clock in/out with calendar view
- **Leave Management** - Apply, approve, and track leaves
- **Payroll** - Comprehensive salary management
- **Reimbursements** - Expense claim management
- **Complaints** - Anonymous and identified grievance system
- **Policies** - Company policy management
- **Holidays** - Holiday calendar management
- **Departments** - Department structure management
- **Designations** - Job title and hierarchy management

### User Roles
- **HR Administrator** - Full access to all modules
- **Employee** - Limited access to personal data and requests

## 🛠️ Technology Stack

### Frontend
- **React** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **shadcn/ui** - UI components
- **React Query** - Data fetching
- **React Router** - Routing
- **Recharts** - Data visualization
- **date-fns** - Date manipulation

### Backend
- **Node.js** - Runtime
- **Express** - Web framework
- **Sequelize** - ORM
- **PostgreSQL** - Database
- **JWT** - Authentication
- **bcrypt** - Password hashing
- **CORS** - Cross-origin resource sharing

## 📂 Project Structure

```
hr-harmony/
├── src/                    # Frontend source code
│   ├── components/         # React components
│   │   ├── layout/        # Layout components
│   │   └── ui/            # UI components
│   ├── contexts/          # React contexts
│   ├── pages/             # Page components
│   ├── services/          # API services
│   ├── types/             # TypeScript types
│   └── lib/               # Utility functions
├── backend/               # Backend source code
│   ├── src/
│   │   ├── config/       # Configuration
│   │   ├── controllers/  # Route controllers
│   │   ├── middleware/   # Express middleware
│   │   ├── models/       # Database models
│   │   ├── routes/       # API routes
│   │   └── seeders/      # Database seeders
│   └── package.json
├── public/               # Static assets
└── package.json
```

## 🔐 Authentication

The application uses JWT-based authentication:

1. User logs in with email and password
2. Backend validates credentials and returns JWT token
3. Token is stored in localStorage
4. Token is sent with every API request in Authorization header
5. Backend validates token for protected routes

### Default Credentials (Development)
```
HR Account:
Email: hr@company.com
Password: password123

Employee Account:
Email: john.doe@company.com
Password: password123
```

## 🗄️ Database

### Setup

1. Create a PostgreSQL database:
```sql
CREATE DATABASE hrms_db;
```

2. Run database sync (creates tables):
```bash
cd backend
npm run db:sync
```

3. Seed initial data:
```bash
npm run db:seed
```

### Models
- Users/Employees
- Departments
- Designations
- Attendance
- Leaves
- Reimbursements
- Complaints
- Policies
- Holidays
- Payroll

## 🚢 Deployment

### Frontend (Vercel/Netlify)
1. Build the frontend:
```bash
npm run build
```

2. Deploy the `dist` folder to your hosting service

3. Set environment variable:
```
VITE_API_URL=https://your-backend-url.com
```

### Backend (Railway/Heroku)
1. Push code to your hosting service
2. Set environment variables from `.env.production`
3. Run database migrations
4. Start the server

## 🧪 Testing

```bash
# Run frontend tests
npm test

# Run backend tests
cd backend
npm test
```

## 📝 API Documentation

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration

### Employees
- `GET /api/employees` - Get all employees
- `GET /api/employees/:id` - Get employee by ID
- `POST /api/employees` - Create employee
- `PUT /api/employees/:id` - Update employee
- `DELETE /api/employees/:id` - Delete employee

### Attendance
- `GET /api/attendance/logs` - Get attendance logs
- `POST /api/attendance/mark` - Mark attendance
- `GET /api/attendance/summary` - Get attendance summary

### Leaves
- `GET /api/leaves/requests` - Get leave requests
- `POST /api/leaves/apply` - Apply for leave
- `PUT /api/leaves/:id/approve` - Approve leave
- `PUT /api/leaves/:id/reject` - Reject leave

*(And more endpoints for other modules)*

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support, email support@hrharmony.com or open an issue in the repository.

## 🎉 Acknowledgments

- Built with [Lovable](https://lovable.dev)
- UI components from [shadcn/ui](https://ui.shadcn.com)
- Icons from [Lucide](https://lucide.dev)

---

**Made with ❤️ by the HR Harmony Team**
