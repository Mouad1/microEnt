#!/bin/bash

# Docker Registry Deployment Script for Dokploy
# Usage: ./deploy.sh [your-dockerhub-username]

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
DOCKER_USERNAME=${1:-"your-username"}
IMAGE_NAME="activity-report-generator"
VERSION=$(node -p "require('./package.json').version")

echo -e "${YELLOW}🚀 Starting Docker deployment process...${NC}"

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo -e "${RED}❌ Docker is not running. Please start Docker and try again.${NC}"
    exit 1
fi

# Build the image
echo -e "${YELLOW}📦 Building Docker image...${NC}"
docker build -t ${DOCKER_USERNAME}/${IMAGE_NAME}:latest \
             -t ${DOCKER_USERNAME}/${IMAGE_NAME}:${VERSION} .

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Docker image built successfully${NC}"
else
    echo -e "${RED}❌ Docker build failed${NC}"
    exit 1
fi

# Login to Docker Hub (if not already logged in)
echo -e "${YELLOW}🔐 Checking Docker Hub authentication...${NC}"
if ! docker info | grep -q "Username"; then
    echo -e "${YELLOW}Please login to Docker Hub:${NC}"
    docker login
fi

# Push to Docker Hub
echo -e "${YELLOW}📤 Pushing to Docker Hub...${NC}"
docker push ${DOCKER_USERNAME}/${IMAGE_NAME}:latest
docker push ${DOCKER_USERNAME}/${IMAGE_NAME}:${VERSION}

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Successfully pushed to Docker Hub!${NC}"
    echo -e "${GREEN}📋 Image details:${NC}"
    echo -e "   Latest: ${DOCKER_USERNAME}/${IMAGE_NAME}:latest"
    echo -e "   Version: ${DOCKER_USERNAME}/${IMAGE_NAME}:${VERSION}"
    echo ""
    echo -e "${YELLOW}🚀 Dokploy Deployment Instructions:${NC}"
    echo -e "1. In Dokploy, create a new application"
    echo -e "2. Select 'Docker Image' as source type"
    echo -e "3. Use image: ${DOCKER_USERNAME}/${IMAGE_NAME}:latest"
    echo -e "4. Set port mapping: 80 (container) -> 80 or 443 (host)"
    echo -e "5. Add environment variables if needed"
    echo -e "6. Deploy! 🎉"
else
    echo -e "${RED}❌ Failed to push to Docker Hub${NC}"
    exit 1
fi
