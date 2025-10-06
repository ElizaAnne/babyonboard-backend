# Makefile for Vite development server

# Variables
PORT = 5173
HOST = 127.0.0.1
NODE_ENV = development

# Default target
.PHONY: default
default: dev

# Start development server
.PHONY: dev
dev:
	npm run dev -- --host $(HOST) --port $(PORT)

# Build for production
.PHONY: build
build:
	npm run build

# Preview the production build
.PHONY: preview
preview:
	npm run preview -- --host $(HOST) --port $(PORT)

# Install dependencies
.PHONY: install
install:
	npm install

# Clean node_modules and build directories
.PHONY: clean
clean:
	rm -rf node_modules
	rm -rf dist

# Lint the codebase
.PHONY: lint
lint:
	npm run lint

# Run tests
.PHONY: test
test:
	npm test

# Start development with environment variables from .env file
.PHONY: dev-env
dev-env:
	NODE_ENV=$(NODE_ENV) npm run dev -- --host $(HOST) --port $(PORT)

# Help command
.PHONY: help
help:
	@echo "Available commands:"
	@echo "  make dev         - Start development server on $(HOST):$(PORT)"
	@echo "  make build       - Build for production"
	@echo "  make preview     - Preview production build"
	@echo "  make install     - Install dependencies"
	@echo "  make clean       - Remove node_modules and build directories"
	@echo "  make lint        - Run linter"
	@echo "  make test        - Run tests"
	@echo "  make dev-env     - Start dev server with NODE_ENV set"
	@echo "  make help        - Show this help message"
HOST = 0.0.0.0
NODE_ENV = development

# Default target
.PHONY: default
default: dev

# Start development server
.PHONY: dev
dev:
	npm run dev -- --host $(HOST) --port $(PORT)

# Build for production
.PHONY: build
build:
	npm run build

# Preview the production build
.PHONY: preview
preview:
	npm run preview -- --host $(HOST) --port $(PORT)

# Install dependencies
.PHONY: install
install:
	npm install

# Clean node_modules and build directories
.PHONY: clean
clean:
	rm -rf node_modules
	rm -rf dist

# Lint the codebase
.PHONY: lint
lint:
	npm run lint

# Run tests
.PHONY: test
test:
	npm test

# Start development with environment variables from .env file
.PHONY: dev-env
dev-env:
	NODE_ENV=$(NODE_ENV) npm run dev -- --host $(HOST) --port $(PORT)

# Help command
.PHONY: help
help:
	@echo "Available commands:"
	@echo "  make dev         - Start development server on $(HOST):$(PORT)"
	@echo "  make build       - Build for production"
	@echo "  make preview     - Preview production build"
	@echo "  make install     - Install dependencies"
	@echo "  make clean       - Remove node_modules and build directories"
	@echo "  make lint        - Run linter"
	@echo "  make test        - Run tests"
	@echo "  make dev-env     - Start dev server with NODE_ENV set"
	@echo "  make help        - Show this help message"