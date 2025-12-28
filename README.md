# Task Management Application

A full-stack task management application built with React, Express, and PostgreSQL. The application allows users to create accounts, authenticate, and manage their personal tasks with different statuses.

## Tech Stack

### Frontend

- **React** 19 with TypeScript
- **Vite** - Build tool
- **Mantine UI** - Component library
- **TanStack Query** - Data fetching and state management
- **Zustand** - State management
- **Axios** - HTTP client
- **React Router** - Navigation

### Backend

- **Express** - Web framework
- **TypeScript** - Type safety
- **Prisma** - ORM
- **PostgreSQL** - Database
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **Zod** - Schema validation

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher)
- **npm**
- **PostgreSQL** database

## Setup Instructions

### 1. Clone the Repository

```bash
git clone <repository-url>
cd assignment
```

### 2. Backend Setup

Navigate to the backend directory:

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

Create a `.env` file in the backend directory with the following variables:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/database_name"

# Server
PORT=3000

# JWT
JWT_SECRET=your-secret-key-here
JWT_EXPIRES_IN=7d
```

Generate Prisma Client:

```bash
npx prisma generate
```

Run database migrations:

```bash
npx prisma migrate dev
```

### 3. Frontend Setup

Navigate to the frontend directory:

```bash
cd ../frontend
```

Install dependencies:

```bash
npm install
```

Create a `.env` file in the frontend directory:

```env
VITE_API_URL=http://localhost:3000/api
```

## How to Run the Project

### Development Mode

You'll need to run both the backend and frontend servers.

#### Start the Backend Server

In the `backend` directory:

```bash
npm run dev
```

The backend server will start on `http://localhost:3000` (or the port specified in your `.env` file).

#### Start the Frontend Development Server

In a new terminal, navigate to the `frontend` directory:

```bash
npm run dev
```

The frontend will be available at `http://localhost:5173` (default Vite port).

### Production Build

#### Backend

```bash
cd backend
npm run build
npm start
```

#### Frontend

```bash
cd frontend
npm run build
npm run preview
```

## API Endpoints

Base URL: `http://localhost:3000/api`

### Authentication Endpoints

#### Register a New User

```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "string",
  "email": "string",
  "password": "string"
}
```

**Response:**

```json
{
  "status": "success",
  "message": "User registered successfully",
  "data": {
    "token": "jwt-token",
    "user": {
      "id": "string",
      "name": "string",
      "email": "string"
    }
  }
}
```

#### Login

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "string",
  "password": "string"
}
```

**Response:**

```json
{
  "status": "success",
  "message": "Login successful",
  "data": {
    "token": "jwt-token",
    "user": {
      "id": "string",
      "name": "string",
      "email": "string"
    }
  }
}
```

### Task Endpoints

All task endpoints require authentication. Include the JWT token in the Authorization header:

```http
Authorization: Bearer <your-jwt-token>
```

#### Create a Task

```http
POST /api/tasks
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "string",
  "description": "string (optional)",
}
```

**Response:**

```json
{
  "status": "success",
  "message": "Task created successfully",
  "data": {
    "id": "string",
    "title": "string",
    "description": "string",
    "status": "PENDING",
    "userId": "string",
    "createdAt": "timestamp",
    "updatedAt": "timestamp"
  }
}
```

#### Get All Tasks (for authenticated user)

```http
GET /api/tasks
Authorization: Bearer <token>
```

**Response:**

```json
{
  "status": "success",
  "data": [
    {
      "id": "string",
      "title": "string",
      "description": "string",
      "status": "PENDING",
      "userId": "string",
      "createdAt": "timestamp",
      "updatedAt": "timestamp"
    }
  ]
}
```

#### Update Task Status

```http
PUT /api/tasks/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "PENDING" | "IN_PROGRESS" | "DONE" (optional)
}
```

**Response:**

```json
{
  "status": "success",
  "message": "Task updated successfully",
  "data": {
    "id": "string",
    "title": "string",
    "description": "string",
    "status": "IN_PROGRESS",
    "userId": "string",
    "createdAt": "timestamp",
    "updatedAt": "timestamp"
  }
}
```

#### Delete a Task

```http
DELETE /api/tasks/:id
Authorization: Bearer <token>
```

**Response:**

```json
{
  "status": "success",
  "message": "Task deleted successfully",
  "data": null
}
```

## Database Schema

### User Model

- `id` - Unique identifier (CUID)
- `name` - User's name
- `email` - Unique email address
- `password` - Hashed password
- `tasks` - Relation to tasks
- `createdAt` - Creation timestamp
- `updatedAt` - Last update timestamp

### Task Model

- `id` - Unique identifier (CUID)
- `title` - Task title
- `description` - Optional task description
- `status` - Task status (PENDING, IN_PROGRESS, DONE)
- `userId` - Foreign key to User
- `deletedAt` - Soft delete timestamp
- `createdAt` - Creation timestamp
- `updatedAt` - Last update timestamp

## Project Structure

```
assignment/
├── backend/
│   ├── src/
│   │   ├── controllers/     # Request handlers
│   │   ├── routes/          # API routes
│   │   ├── middlewares/     # Custom middleware
│   │   ├── utils/           # Utility functions
│   │   └── index.ts         # Entry point
│   ├── prisma/
│   │   └── schema.prisma    # Database schema
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── components/      # React components
    │   ├── pages/           # Page components
    │   ├── hooks/           # Custom hooks
    │   └── utils/           # Utility functions
    └── package.json
```

## Author

Ahmed Sholah
