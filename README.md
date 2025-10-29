# Movie List Application

A full-stack movie list application with React frontend and Express/MongoDB backend.
Test it out: [https://ouihui.github.io/movie-list/](https://ouihui.github.io/movie-list/)

**Deployed with Docker, AWS EC2, NGINX reverse proxy, and GitHub Actions CI/CD pipeline.**

### Running locally
```bash
# From the movie list directory
npm install
npm run dev
```

## Project Structure
```
movie list/
├── backend/           # Express server and MongoDB
├── frontend/          # React frontend
├── nginx/             # NGINX reverse proxy configuration
├── .github/           # GitHub Actions CI/CD workflows
└── package.json       # Root package.json with scripts
```
## Features

- Add, edit, and delete movies
- Drag and drop ranking
- Search functionality
- Image poster requirements
- MongoDB integration
- Responsive design
- Dockerized backend deployment
- AWS EC2 hosting with NGINX reverse proxy
- Automated CI/CD pipeline with GitHub Actions

## Deployment

### Production Deployment
The backend is deployed on AWS EC2 with Docker and NGINX reverse proxy. Every push to the `main` branch triggers an automated deployment via GitHub Actions.

- **Backend**: Deployed on AWS EC2
- **Frontend**: Deployed on GitHub Pages
- **CI/CD**: GitHub Actions
- **Reverse Proxy**: NGINX

