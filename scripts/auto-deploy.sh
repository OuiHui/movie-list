#!/bin/bash
# Auto-deploy script for EC2 instance
# Pulls the latest Docker image and restarts the container

echo "Starting auto-deployment..."
echo "Timestamp: $(date)"

# Configuration
DOCKER_IMAGE="${DOCKER_USERNAME}/movie-list-backend:latest"
CONTAINER_NAME="movie-list-backend"

if ! systemctl is-active --quiet docker; then
    echo "Docker is not running. Starting Docker..."
    sudo systemctl start docker
fi

echo "Pulling latest Docker image: $DOCKER_IMAGE"
docker pull $DOCKER_IMAGE

if [ $? -ne 0 ]; then
    echo "Failed to pull Docker image!"
    exit 1
fi

echo "Stopping existing container..."
docker stop $CONTAINER_NAME 2>/dev/null || true
docker rm $CONTAINER_NAME 2>/dev/null || true

echo "Starting new container..."
docker run -d \
    --name $CONTAINER_NAME \
    --restart unless-stopped \
    -p 5000:5000 \
    -e MONGODB_URI="$MONGODB_URI" \
    -e PORT=5000 \
    $DOCKER_IMAGE

if [ $? -eq 0 ]; then
    echo "Container started successfully!"
    echo "Container status:"
    docker ps | grep $CONTAINER_NAME
else
    echo "Failed to start container!"
    exit 1
fi

echo "Cleaning up old images..."
docker image prune -af
echo "Auto-deployment completed successfully!"
echo "Backend is running at: http://$(curl -s ifconfig.me):5000"