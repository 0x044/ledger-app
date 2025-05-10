# Machine Repair Tracking System

A full-stack application for tracking machine status and repair history across different departments. Built with MongoDB, Express, React, and Node.js (MERN stack).

## Table of Contents
- [Features](#features)
- [System Architecture](#system-architecture)
- [Technologies Used](#technologies-used)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [API Endpoints](#api-endpoints)
- [Testing](#testing)
- [Docker Configuration](#docker-configuration)
- [Contributing](#contributing)
- [License](#license)

## Features

- **User Authentication:** Secure login and registration system
- **Machine Management:** Create and view machines by department
- **Repair Tracking:** Log machine repairs with status updates
- **Repair History:** Maintain comprehensive repair history with technician information
- **Docker Support:** Containerized setup for easy deployment

## System Architecture

The application follows a three-tier architecture:

1. **Frontend:** React application with TypeScript and Material UI
2. **Backend:** Express.js REST API with JWT authentication
3. **Database:** MongoDB for persistent data storage

All components are containerized using Docker for consistent deployment across environments.

## Technologies Used

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose ORM
- JWT for authentication
- bcryptjs for password hashing

### Frontend
- React 19
- TypeScript
- Material UI components
- React Router for navigation
- Axios for API requests

### DevOps
- Docker and Docker Compose
- Nginx as reverse proxy for the frontend
- Jest and Supertest for API testing

## Prerequisites

Before you begin, ensure you have the following installed:

- [Docker](https://www.docker.com/get-started) (version 20.10.0+)
- [Docker Compose](https://docs.docker.com/compose/install/) (version 2.0.0+)
- [Git](https://git-scm.com/downloads)

For local development:
- [Node.js](https://nodejs.org/) (version 20.x)
- [npm](https://www.npmjs.com/) (usually comes with Node.js)

## Getting Started

### Using Docker (Recommended)

1. Clone the repository
   ```bash
   git clone <repository-url>
   cd machine-repair-tracking
   ```

2. Create `.env` file in the project root (optional - defaults are provided in docker-compose.yml)
   ```
   MONGODB_URI=mongodb://mongodb:27017/machine-repair
   JWT_SECRET=your_secure_jwt_secret
   ```

3. Start the application using Docker Compose
   ```bash
   docker-compose up -d
   ```

4. Access the application
   - Frontend: http://localhost:80
   - Backend API: http://localhost:5000
   - MongoDB: mongodb://localhost:27017

### Manual Setup (Development)

1. Clone the repository
   ```bash
   git clone <repository-url>
   cd machine-repair-tracking
   ```

2. Set up the backend
   ```bash
   cd backend
   npm install
   
   # Create .env file
   echo "MONGODB_URI=mongodb://localhost:27017/machine-repair" > .env
   echo "JWT_SECRET=your_secure_jwt_secret" >> .env
   
   # Start the backend server
   npm run dev
   ```

3. Set up the frontend (in a new terminal)
   ```bash
   cd frontend
   npm install
   npm start
   ```

4. Access the application
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## Project Structure

```
machine-repair-tracking/
├── backend/                  # Backend Express application
│   ├── config/               # Database configuration
│   ├── models/               # Mongoose schemas
│   ├── tests/                # API tests
│   ├── Dockerfile            # Backend container configuration
│   ├── package.json          # Backend dependencies
│   └── server.js             # Express server setup
├── frontend/                 # React frontend application
│   ├── public/               # Static files
│   ├── src/                  # React components and logic
│   ├── Dockerfile            # Frontend container configuration
│   ├── nginx.conf            # Nginx configuration
│   ├── package.json          # Frontend dependencies
│   └── tsconfig.json         # TypeScript configuration
├── docker-compose.yml        # Docker services configuration
└── README.md                 # Project documentation
```

## API Endpoints

### Authentication
- `POST /api/users/register` - Register a new user
- `POST /api/users/login` - User login

### Machines
- `POST /api/machines` - Create a new machine
- `GET /api/machines` - Get all machines
- `GET /api/machines/department/:department` - Get machines by department
- `POST /api/machines/:id/repair` - Update machine repair status

## Testing

The project includes automated tests for the backend API.

```bash
# Run tests from the backend directory
cd backend
npm test
```

The tests use an in-memory MongoDB server to avoid affecting your actual database.

## Docker Configuration

The application uses Docker Compose with three services:

1. **backend** - Node.js API server
   - Builds from `./backend/Dockerfile`
   - Exposes port 5000
   - Connects to MongoDB container

2. **frontend** - React application served via Nginx
   - Builds from `./frontend/Dockerfile`
   - Uses multi-stage build for optimized production build
   - Exposes port 80

3. **mongodb** - MongoDB database
   - Uses official MongoDB image
   - Persists data using Docker volumes
   - Exposes port 27017

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.