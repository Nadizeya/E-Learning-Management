# Build stage
FROM maven:3.9-eclipse-temurin-17 AS build

WORKDIR /app

COPY pom.xml .
COPY src ./src

# Single build (avoids flaky dependency:go-offline on some CI hosts)
RUN mvn -B -DskipTests package \
    && cp "$(ls target/*.jar | grep -v plain | head -n1)" /app/app.jar

# Runtime
FROM eclipse-temurin:17-jre-alpine

WORKDIR /app

COPY --from=build /app/app.jar app.jar

# Railway and other hosts set PORT
ENV PORT=8080
ENV JAVA_OPTS=""

EXPOSE 8080

ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar --server.port=${PORT}"]
