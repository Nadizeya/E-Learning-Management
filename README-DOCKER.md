# Docker Setup for LMS E-Learning Application

This project includes Docker configuration for running MySQL database and PhpMyAdmin. The Spring Boot application runs locally and connects to the Dockerized database.

## Services

- **MySQL Database**: Running on port `3306`
- **PhpMyAdmin**: Web interface accessible at `http://localhost:8081`

## Prerequisites

- Docker Desktop installed and running
- Docker Compose installed

## Getting Started

### 1. Start all services

```bash
docker-compose up -d
```

This will start:
- MySQL database container
- PhpMyAdmin container

### 2. Run your Spring Boot application locally

Run the application from your IDE or using Maven:

```bash
mvn spring-boot:run
```

Or if you have the JAR built:

```bash
java -jar target/lms_e_learn-0.0.1-SNAPSHOT.jar
```

The application will connect to the MySQL database running in Docker on `localhost:3306`.

### 3. Access the services

- **PhpMyAdmin**: http://localhost:8081
  - Server: `mysql`
  - Username: `root`
  - Password: `root_password`
  
  Or use the application user:
  - Username: `lms_user`
  - Password: `lms_password`

- **Spring Boot API**: http://localhost:8080 (when running locally)

### 4. View Docker logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f mysql
docker-compose logs -f phpmyadmin
```

### 5. Stop Docker services

```bash
docker-compose down
```

### 6. Stop and remove volumes (deletes database data)

```bash
docker-compose down -v
```

## Database Configuration

- **Database Name**: `lms_elearn_db`
- **Root Password**: `root_password`
- **Application User**: `lms_user`
- **Application Password**: `lms_password`

Your Spring Boot application is configured to connect to this database via `application.properties`.

## Troubleshooting

### Application can't connect to database

Make sure Docker containers are running (`docker-compose ps`) and MySQL is healthy. Wait a few seconds for MySQL to fully initialize after starting.

### Port conflicts

If ports 3306 or 8081 are already in use, modify the ports in `docker-compose.yml`:

```yaml
ports:
  - "YOUR_PORT:CONTAINER_PORT"
```

### View database in PhpMyAdmin

1. Go to http://localhost:8081
2. Login with credentials above
3. Select `lms_elearn_db` database from the left sidebar
