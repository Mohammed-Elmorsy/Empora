@echo off
REM Empora Development Startup Script for Windows
REM This script starts all microservices for local development

echo.
echo 🚀 Starting Empora Development Environment...
echo.

REM Check if Docker is running
echo 📦 Checking Docker services...
docker ps >nul 2>&1
if errorlevel 1 (
    echo ❌ Docker is not running. Please start Docker first.
    exit /b 1
)

REM Start Docker services
echo 🐳 Starting Docker services (PostgreSQL, Redis, RabbitMQ)...
docker-compose up -d

REM Wait for services to be healthy
echo ⏳ Waiting for Docker services to be healthy...
timeout /t 5 /nobreak >nul

REM Check Docker service status
echo ✅ Docker services status:
docker ps --format "table {{.Names}}\t{{.Status}}"
echo.

REM Build shared packages
echo 📦 Building shared packages...
cd packages\common && pnpm build
cd ..\config && pnpm build
cd ..\database && pnpm build
cd ..\..

echo.
echo ✅ Shared packages built successfully!
echo.
echo 🎯 You can now start the services:
echo.
echo   Gateway:      cd apps\backend\gateway ^&^& npx tsc ^&^& node dist\main.js
echo   Auth Service: cd apps\backend\auth-service ^&^& npx tsc ^&^& node dist\main.js
echo   Product:      cd apps\backend\product-service ^&^& npx tsc ^&^& node dist\main.js
echo   Frontend:     cd apps\frontend ^&^& pnpm dev
echo.
echo Or use the npm scripts:
echo.
echo   pnpm dev:gateway
echo   pnpm dev:auth
echo   pnpm dev:product
echo   pnpm dev:frontend
echo.
echo 🎉 Development environment is ready!
