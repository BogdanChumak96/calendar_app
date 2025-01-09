# Project: Calendar App

This project is a web application for managing tasks using a calendar interface. It is built with technologies such as React, TypeScript, Axios, React Query, NestJS and Docker Compose.

## 🚀 Quick Start

### 1. Prerequisites

Before starting, ensure that the following tools are installed on your computer:

- [Docker](https://www.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/)

### 2. Installation and Project Setup

1. **Clone the repository:**

   ```bash
   git clone https://github.com/BogdanChumak96/calendar_app
   cd your-repo
   ```

2. **Create a `.env` file:**
   In the root directory, create a `.env` file and add the required environment variables. Example:

   ```env
   VITE_APP_API_BASE_URL=http://localhost:3000
   ```

3. **Start the project:**
   Run the following command to start all services using Docker Compose:

   ```bash
   docker-compose up --build
   ```

4. **Access the application:**
   Once the services are running, the application will be available at:
   ```
   http://localhost:8080
   ```

### 3. Key Docker Compose Commands

- **Start the project:**

  ```bash
  docker-compose up
  ```

- **Stop the project:**

  ```bash
  docker-compose down
  ```

- **Rebuild the containers:**

  ```bash
  docker-compose up --build
  ```

- **View logs:**
  ```bash
  docker-compose logs -f
  ```

### 4. Troubleshooting

- **Port conflicts:**
  Ensure that port 3000 (or the ports specified in `docker-compose.yml`) is not being used by other services.

- **Build errors:**
  Double-check that the environment variables in `.env` are configured correctly.
