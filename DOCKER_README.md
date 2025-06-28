# Movie Ranking App - Docker Setup

This document explains how to run the Movie Ranking application using Docker containers.

## 🐳 Prerequisites

- [Docker](https://www.docker.com/get-started) installed on your system
- [Docker Compose](https://docs.docker.com/compose/install/) installed
- At least 2GB of available RAM
- Ports 80, 5000, and 27017 available

## 🚀 Quick Start (Production)

### 1. Clone and Navigate
```bash
git clone <your-repository>
cd movie-ranking-app
```

### 2. Start All Services
```bash
docker-compose up -d
```

### 3. Access the Application
- **Frontend**: http://localhost
- **Backend API**: http://localhost:5000
- **MongoDB**: localhost:27017

### 4. Stop All Services
```bash
docker-compose down
```

## 🔧 Development Mode

For development with hot reloading:

```bash
# Start development environment
docker-compose -f docker-compose.dev.yml up -d

# View logs
docker-compose -f docker-compose.dev.yml logs -f

# Stop development environment
docker-compose -f docker-compose.dev.yml down
```

**Development URLs:**
- Frontend: http://localhost:3000
- Backend: http://localhost:5000
- MongoDB: localhost:27017

## 📦 Container Details

### Services

1. **Frontend (Nginx + React)**
   - Built with Vite
   - Served by Nginx with reverse proxy
   - Port: 80 (production) / 3000 (development)

2. **Backend (Node.js + Express)**
   - RESTful API with Express
   - MongoDB connection
   - Port: 5000

3. **Database (MongoDB)**
   - MongoDB 7.0
   - Persistent data volume
   - Port: 27017

### Environment Variables

**Backend:**
- `NODE_ENV`: production/development
- `PORT`: 5000
- `MONGODB_URI`: Connection string

**Frontend:**
- `VITE_API_URL`: API endpoint (optional)

## 🛠️ Useful Commands

### Build and Start
```bash
# Build and start production
docker-compose up --build -d

# Build and start development
docker-compose -f docker-compose.dev.yml up --build -d
```

### Viewing Logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f mongodb
```

### Database Management
```bash
# Access MongoDB shell
docker exec -it movie-app-mongodb mongosh -u admin -p password123

# Backup database
docker exec movie-app-mongodb mongodump --uri="mongodb://admin:password123@localhost:27017/movieapp?authSource=admin" --out=/backup

# Restore database
docker exec movie-app-mongodb mongorestore --uri="mongodb://admin:password123@localhost:27017/movieapp?authSource=admin" /backup/movieapp
```

### Container Management
```bash
# View running containers
docker ps

# Stop specific container
docker stop movie-app-frontend

# Remove containers and volumes
docker-compose down -v

# Clean up unused images
docker system prune -a
```

## 🔍 Troubleshooting

### Common Issues

1. **Port Already in Use**
   ```bash
   # Check what's using the port
   netstat -tulpn | grep :80
   
   # Kill process or change port in docker-compose.yml
   ```

2. **Database Connection Issues**
   ```bash
   # Check MongoDB logs
   docker-compose logs mongodb
   
   # Restart database
   docker-compose restart mongodb
   ```

3. **Frontend Not Loading**
   ```bash
   # Check nginx configuration
   docker exec -it movie-app-frontend cat /etc/nginx/conf.d/default.conf
   
   # Rebuild frontend
   docker-compose up --build frontend
   ```

4. **API Calls Failing**
   - Check if backend is running: `docker-compose logs backend`
   - Verify API endpoint in browser: http://localhost:5000/api/health
   - Check network connectivity between containers

### Health Checks

```bash
# Check backend health
curl http://localhost:5000/api/health

# Check frontend
curl http://localhost

# Check MongoDB
docker exec movie-app-mongodb mongosh --eval "db.runCommand('ping')"
```

## 📁 File Structure

```
movie-ranking-app/
├── docker-compose.yml          # Production setup
├── docker-compose.dev.yml      # Development setup
├── init-mongo.js              # MongoDB initialization
├── backend/
│   ├── Dockerfile             # Production backend image
│   ├── Dockerfile.dev         # Development backend image
│   ├── .dockerignore
│   └── ...
├── frontend/
│   ├── Dockerfile             # Production frontend image
│   ├── Dockerfile.dev         # Development frontend image
│   ├── nginx.conf             # Nginx configuration
│   ├── .dockerignore
│   └── ...
```

## 🔒 Security Notes

- Default MongoDB credentials are for development only
- Change passwords in production environment
- Use environment files for sensitive data
- Enable MongoDB authentication in production
- Configure proper firewall rules

## 📝 Environment Configuration

Create `.env` files for production:

**.env.backend:**
```
NODE_ENV=production
MONGODB_URI=mongodb://admin:your-secure-password@mongodb:27017/movieapp?authSource=admin
```

**.env.frontend:**
```
VITE_API_URL=/api
```

## 🚀 Production Deployment

For production deployment:

1. Update MongoDB credentials
2. Use environment files
3. Configure proper volumes for data persistence
4. Set up SSL/TLS certificates
5. Configure proper logging
6. Set up monitoring and health checks

```bash
# Production deployment
docker-compose --env-file .env.prod up -d
```
