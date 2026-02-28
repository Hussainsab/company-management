# Company Management System

A comprehensive web application for managing companies, employees, projects, and clients. This system provides role-based access control, project lifecycle management, and detailed reporting.

## Features

- **Authentication**: Secure login with JWT tokens.
- **Role-Based Access Control**: 
  - **Admin**: Full access to all features including user management and company creation.
  - **client**: can request a service.
  - **Employee**: Can view assigned projects and tasks.
- **Company Management**:
  - Create, update, and delete company profiles.
  - Track company details including address, industry, and status.
- **Employee Management**:
  - Add and manage employee records.
  - Assign employees to companies.
  - Track employee availability and roles.
- **Project Management**:
  - Create and manage projects with detailed information (client, timeline, status).
  - Assign employees to projects.
  - Track project progress and milestones.
- **Client Management**:
  - Add and manage client profiles.
  - Link clients to projects.
- **Dashboard**:
  - Overview of system statistics.
  - Quick access to recent activities and pending tasks.

## Tech Stack

### Frontend
- **React**: UI library for building the user interface.
- **TypeScript**: Static type checking for JavaScript.
- **Tailwind CSS**: Utility-first CSS framework for styling.
- **Lucide React**: Icon library.
- **React Router**: For client-side routing.
- **Redux Toolkit**: State management.
- **Axios**: HTTP client for API communication.

### Backend
- **Node.js**: JavaScript runtime for the server.
- **Express**: Web framework for building APIs.
- **TypeScript**: Static type checking for JavaScript.
- **Sequelize**: ORM for database interactions.
- **PostgreSQL**: Relational database.
- **Bcrypt.js**: Password hashing.
- **JWT (jsonwebtoken)**: Authentication tokens.

## Prerequisites

- Node.js (v14 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

## Installation

### Backend

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   - Copy the `.env.example` file to `.env`:
     ```bash
     cp .env.example .env
     ```
   - Update the variables in `.env` with your local configuration (e.g., database credentials, JWT secret).

4. Set up the database:
   - Ensure PostgreSQL is running.
   - Create a database named `company_management` (or match the `DB_NAME` in your `.env` file).
   - Run migrations:
     ```bash
     npm sequelize db:migrate
     ```

5. **For Local Development**: Start the development server
   ```bash
   npm run dev
   ```

### Running in Production
1. Build the TypeScript code into JavaScript:
   ```bash
   npm run build
   ```

2. Start the production server:
   ```bash
   npm run start
   ```

### Frontend

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

## Usage

### Login

Use the following credentials to log in:

**Admin**:
- Email: [EMAIL_ADDRESS]`
- Password: `admin123`

**Manager**:
- Email: [EMAIL_ADDRESS]`
- Password: `manager123`

**Employee**:
- Email: [EMAIL_ADDRESS]`
- Password: `employee123`

### API Endpoints

The backend API is available at `http://localhost:5000`.

Key endpoints include:
- `POST /auth/login` - User login
- `GET /companies` - Get all companies
- `POST /companies` - Create a new company
- `GET /employees` - Get all employees
- `POST /employees` - Create a new employee
- `GET /projects` - Get all projects
- `POST /projects` - Create a new project
- `GET /clients` - Get all clients
- `POST /clients` - Create a new client

## Development

### Adding New Features

When adding new features, follow these guidelines:

1. **Update API Service**: Add new methods to `frontend/src/services/apiService.ts`.
2. **Create Components**: Create new components in `frontend/src/components/` or `frontend/src/pages/`.
3. **Update Routes**: Add new routes to `frontend/src/App.tsx`.
4. **Update Store**: If needed, update `frontend/src/store/`.

### Database Migrations

To create a new migration:
```bash
npx sequelize-cli migration:create --name=your-migration-name
```

To run migrations:
```bash
npx sequelize-cli db:migrate
```

To rollback the last migration:
```bash
npx sequelize-cli db:migrate:undo
```

## Production

To build the frontend for production:
```bash
cd frontend
npm run build
```

The production build will be created in the `dist` folder.


## Demo
![Alt text for the image](./assets/demo.gif)