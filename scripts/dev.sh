#!/bin/bash

# Empora Development Startup Script
# This script starts all microservices for local development

echo "🚀 Starting Empora Development Environment..."
echo ""

# Check if Docker is running
echo "📦 Checking Docker services..."
if ! docker ps > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker first."
    exit 1
fi

# Start Docker services
echo "🐳 Starting Docker services (PostgreSQL, Redis, RabbitMQ)..."
docker-compose up -d

# Wait for services to be healthy
echo "⏳ Waiting for Docker services to be healthy..."
sleep 5

# Check Docker service status
echo "✅ Docker services status:"
docker ps --format "table {{.Names}}\t{{.Status}}"
echo ""

# Build shared packages
echo "📦 Building shared packages..."
cd packages/common && npm run build
cd ../config && npm run build
cd ../database && npm run build
cd ../..

echo ""
echo "✅ Shared packages built successfully!"
echo ""
echo "🎯 You can now start the services:"
echo ""
echo "  Gateway:      cd apps/backend/gateway && npx tsc && node dist/main.js"
echo "  Auth Service: cd apps/backend/auth-service && npx tsc && node dist/main.js"
echo "  Product:      cd apps/backend/product-service && npx tsc && node dist/main.js"
echo "  Frontend:     cd apps/frontend && npm run dev"
echo ""
echo "Or use the npm scripts:"
echo ""
echo "  pnpm dev:gateway"
echo "  pnpm dev:auth"
echo "  pnpm dev:product"
echo "  pnpm dev:frontend"
echo ""
echo "🎉 Development environment is ready!"
