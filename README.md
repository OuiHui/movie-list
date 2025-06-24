# Movie List Application

A full-stack movie list application with React frontend and Express/MongoDB backend.

## Quick Start

### Method 1: Using npm scripts (Recommended)
```bash
# From the movie list directory
npm run dev
```

### Method 2: Using batch file (Windows)
```bash
# Double-click start-app.bat or run from command line
start-app.bat
```

## Available Scripts

- `npm run dev` - Run both frontend and backend in development mode
- `npm run backend` - Run only backend server
- `npm run frontend` - Run only frontend server  
- `npm run install-deps` - Install dependencies for both frontend and backend
- `npm run clean` - Clean node_modules from both projects

## Servers

- **Backend**: http://localhost:5000
- **Frontend**: http://localhost:5173

## Setup Instructions

1. Make sure you have Node.js installed
2. Install dependencies: `npm run install-deps`
3. Set up your MongoDB connection in `backend/.env`
4. Start the application: `npm run dev`

## Project Structure

```
movie list/
├── backend/           # Express server and MongoDB
├── movie_listings/    # React frontend
├── package.json       # Root package.json with scripts
└── start-app.bat     # Windows batch file to start app
```

## Environment Variables

Create a `.env` file in the `backend/` directory:

```
MONGODB_URI=your_mongodb_connection_string
PORT=5000
```

## Features

- Add, edit, and delete movies
- Drag and drop ranking
- Search functionality
- Image poster requirements
- MongoDB integration
- Responsive design
