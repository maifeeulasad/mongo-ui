#!/bin/bash

# MongoDB UI Development Setup Script

echo "🚀 Setting up MongoDB UI development environment..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ and try again."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2)
REQUIRED_VERSION="18.0.0"

if [ "$(printf '%s\n' "$REQUIRED_VERSION" "$NODE_VERSION" | sort -V | head -n1)" != "$REQUIRED_VERSION" ]; then
    echo "❌ Node.js version must be 18.0.0 or higher. Current version: $NODE_VERSION"
    exit 1
fi

echo "✅ Node.js version check passed: $NODE_VERSION"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo "✅ Dependencies installed successfully"

# Run type checking
echo "🔍 Running TypeScript type check..."
npm run type-check

if [ $? -ne 0 ]; then
    echo "⚠️  TypeScript type check failed, but continuing..."
fi

# Run linting
echo "🧹 Running ESLint..."
npm run lint

if [ $? -ne 0 ]; then
    echo "⚠️  ESLint found issues, but continuing..."
fi

echo "🎉 Development environment setup complete!"
echo ""
echo "🚀 To start development:"
echo "   npm run dev"
echo ""
echo "📋 Available commands:"
echo "   npm run dev          - Start development (React + Electron)"
echo "   npm run build        - Build for production"
echo "   npm run test         - Run tests"
echo "   npm run lint         - Run linter"
echo "   npm run format       - Format code"
echo ""
echo "Happy coding! 🎯"