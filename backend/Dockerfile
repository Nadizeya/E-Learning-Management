# ===============================
# Stage 1: Build the Spring Boot JAR
# ===============================
FROM maven:3.9-eclipse-temurin-17 AS build

WORKDIR /app

# Copy Maven descriptor
COPY pom.xml .

# Download dependencies (cached)
RUN mvn -q -B dependency:go-offline

# Copy source
COPY src ./src

# Build application (skip tests for faster CI builds)
RUN mvn -q -DskipTests package

# ===============================
# Stage 2: Run the Spring Boot application
# ===============================
FROM eclipse-temurin:17-jre-alpine

WORKDIR /app

# Copy the JAR from the build stage
COPY --from=build /app/target/*.jar app.jar

# Cloud Run will set PORT dynamically (default 8080)
ENV PORT=8080
ENV JAVA_OPTS=""

EXPOSE 8080

# Start the application
ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar --server.port=${PORT}"]
