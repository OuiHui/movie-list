# Movie List Application

A full-stack movie list application with React frontend and Express/MongoDB backend.
Test it out: [https://ouihui.github.io/movie-list/](https://ouihui.github.io/movie-list/)

**Deployed with Docker, AWS EC2, NGINX reverse proxy, and GitHub Actions CI/CD pipeline.**

### Using npm scripts
```bash
# From the movie list directory
npm run dev
```

## Running Locally

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
## Features

- Add, edit, and delete movies
- Drag and drop ranking
- Search functionality
- Image poster requirements
- MongoDB integration
- Responsive design
- **Dockerized backend deployment**
- **AWS EC2 hosting with NGINX reverse proxy**
- **Automated CI/CD pipeline with GitHub Actions**

## Deployment

### Production Deployment
The backend is deployed on AWS EC2 with Docker and NGINX reverse proxy. Every push to the `main` branch triggers an automated deployment via GitHub Actions.

- **Backend**: Deployed on AWS EC2
- **Frontend**: Deployed on GitHub Pages
- **CI/CD**: GitHub Actions
- **Reverse Proxy**: NGINX

