# AWS EC2 Deployment Architecture

## System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                         DEVELOPER WORKFLOW                          │
└─────────────────────────────────────────────────────────────────────┘
                                   │
                    1. Code Change & Push to GitHub
                                   │
                                   ▼
┌─────────────────────────────────────────────────────────────────────┐
│                          GITHUB ACTIONS                             │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │  CI/CD Pipeline (.github/workflows/deploy-ec2.yml)            │  │
│  │                                                               │  │
│  │  Step 1: Checkout code                                        │  │
│  │  Step 2: Build Docker image                                   │  │
│  │  Step 3: Push to Docker Hub                                   │  │
│  │  Step 4: SSH into EC2                                         │  │
│  │  Step 5: Pull & Deploy new container                          │  │
│  └───────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────┘
                                   │
                    2. Push Docker Image
                                   │
                                   ▼
┌─────────────────────────────────────────────────────────────────────┐
│                           DOCKER HUB                                │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │  Registry: username/movie-list-backend:latest                 │  │
│  │  - Stores built Docker images                                 │  │
│  │  - Version control for deployments                            │  │
│  └───────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────┘
                                   │
                    3. Pull Image via SSH
                                   │
                                   ▼
┌─────────────────────────────────────────────────────────────────────┐
│                        AWS EC2 INSTANCE                             │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │                    Ubuntu 22.04 LTS                          │   │
│  │                                                              │   │
│  │  ┌──────────────────────────────────────────────────────┐    │   │
│  │  │          NGINX Reverse Proxy (Port 80/443)           │    │   │
│  │  │  - Receives all incoming traffic                     │    │   │
│  │  │  - Routes /api requests to backend                   │    │   │
│  │  │  - Handles SSL/TLS (HTTPS)                           │    │   │
│  │  └──────────────────────────────────────────────────────┘    │   │
│  │                          │                                   │   │
│  │                          │ Proxy Pass                        │   │
│  │                          ▼                                   │   │
│  │  ┌──────────────────────────────────────────────────────┐    │   │
│  │  │       Docker Container (Port 5000)                   │    │   │
│  │  │  ┌────────────────────────────────────────────────┐  │    │   │
│  │  │  │    Node.js Express Backend                     │  │    │   │ 
│  │  │  │    - REST API endpoints                        │  │    │   │
│  │  │  │    - Business logic                            │  │    │   │
│  │  │  │    - MongoDB connection                        │  │    │   │
│  │  │  └────────────────────────────────────────────────┘  │    │   │ 
│  │  │                                                      │    │   │ 
│  │  │  Environment Variables:                              │    │   │
│  │  │  - MONGODB_URI                                       │    │   │ 
│  │  │  - PORT=5000                                         │    │   │
│  │  │  - NODE_ENV=production                               │    │   │
│  │  └──────────────────────────────────────────────────────┘    │   │
│  └──────────────────────────────────────────────────────────────┘   │
│                                                                     │
│  Security Group Rules:                                              │
│  - Port 22 (SSH): Your IP only                                      │
│  - Port 80 (HTTP): 0.0.0.0/0                                        │
│  - Port 443 (HTTPS): 0.0.0.0/0                                      │
│  - Port 5000 (Backend): Internal only for testing                   │
└─────────────────────────────────────────────────────────────────────┘
                                   │
                    4. MongoDB Queries
                                   │
                                   ▼
┌─────────────────────────────────────────────────────────────────────┐
│                        MONGODB ATLAS                                │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │  Database: movielist                                          │  │
│  │  Collections:                                                 │  │
│  │  - movies                                                     │  │
│  │  - lists                                                      │  │
│  └───────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────┘
                                   │
                    5. Data Response
                                   │
                                   ▼
┌─────────────────────────────────────────────────────────────────────┐
│                      END USERS / FRONTEND                           │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │  React Frontend (GitHub Pages)                                │  │
│  │  - Sends API requests to: http://EC2_IP/api                   │  │
│  │  - Receives JSON responses                                    │  │
│  │  - Renders UI for users                                       │  │
│  └───────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────┘
```

## Request Flow

### Example: Get Movies List

```
1. User clicks "View Movies" in browser
   └─> Frontend (GitHub Pages)
       
2. Frontend sends GET request
   └─> https://your-ec2-ip/api/lists
       
3. NGINX receives request on port 80/443
   └─> Routes to backend container at localhost:5000
       
4. Docker container processes request
   └─> Express router handles /api/lists endpoint
       
5. Backend queries MongoDB
   └─> Connects to MongoDB Atlas
   └─> Executes: db.lists.find()
       
6. MongoDB returns data
   └─> JSON array of movie lists
       
7. Backend sends response
   └─> Through NGINX back to client
       
8. Frontend displays movies
   └─> User sees their movie collection!
```

## Deployment Flow

### Automated CI/CD Pipeline

```
1. Developer makes code changes
   └─> Edit backend/server.js
       
2. Commit and push to GitHub
   └─> git add .
   └─> git commit -m "Add new feature"
   └─> git push origin main
       
3. GitHub Actions triggered automatically
   └─> Workflow: .github/workflows/deploy-ec2.yml
       
4. Build Docker image
   └─> docker build -t username/movie-list-backend:latest
       
5. Push to Docker Hub
   └─> docker push username/movie-list-backend:latest
       
6. SSH into EC2 instance
   └─> Using stored SSH key from GitHub Secrets
       
7. Pull latest image on EC2
   └─> docker pull username/movie-list-backend:latest
       
8. Stop old container
   └─> docker stop movie-list-backend
   └─> docker rm movie-list-backend
       
9. Start new container
   └─> docker run -d --name movie-list-backend \
       -p 5000:5000 \
       -e MONGODB_URI="..." \
       username/movie-list-backend:latest
       
10. Clean up old images
    └─> docker image prune -af
        
11. Deployment complete!
    └─> New version is live
    └─> Zero downtime achieved
```

## Network Architecture

```
Internet Traffic
      │
      ▼
┌─────────────────┐
│  AWS Route 53   │
│  your-domain.com│
└─────────────────┘
      │
      ▼
┌─────────────────┐
│ EC2 Public IP   │
│ (Elastic IP)    │
└─────────────────┘
      │
      ▼
┌─────────────────┐
│  Security Group │
│  - Port 80      │
│  - Port 443     │
│  - Port 22      │
└─────────────────┘
      │
      ▼
┌─────────────────┐
│  NGINX:80/443   │
└─────────────────┘
      │
      ▼
┌─────────────────┐
│  Docker:5000    │
└─────────────────┘
      │
      ▼
┌─────────────────┐
│  MongoDB Atlas  │
└─────────────────┘
