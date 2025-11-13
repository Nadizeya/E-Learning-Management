# ---------- Build stage ----------
    FROM maven:3.9-eclipse-temurin-17 AS build
    WORKDIR /workspace
    
    # 1) Copy only Maven descriptor first to leverage layer caching of dependencies
    COPY pom.xml ./
    # Pre-download dependencies (speeds subsequent builds when pom.xml unchanged)
    RUN mvn -B -DskipTests dependency:go-offline
    
    # 2) Copy source and build
    COPY src ./src
    # Use batch mode and skip tests in image build (run tests in CI instead)
    RUN mvn -B -DskipTests package
    
    # ---------- Runtime stage ----------
    # Use a smaller JRE base (choose a supported non-alpine jre for best compatibility)
    FROM eclipse-temurin:17-jre-jammy
    WORKDIR /app
    
    # Create a non-root user and set permissions
    RUN useradd --create-home --home-dir /app appuser \
     && mkdir /app/logs \
     && chown -R appuser:appuser /app
    
    # Copy the jar (be explicit if possible; wildcard kept for generic name)
    COPY --from=build /workspace/target/*.jar app.jar
    RUN chown appuser:appuser /app/app.jar
    
    USER appuser
    
    # Expose port (Cloud Run uses $PORT env but adding for clarity)
    ENV PORT=8080
    EXPOSE 8080
    
    # JVM options tuned for container environments (adjust as needed)
    ENV JAVA_TOOL_OPTIONS="-XX:+UseContainerSupport -XX:MaxRAMPercentage=75.0"
    
    ENTRYPOINT ["sh", "-c", "exec java $JAVA_TOOL_OPTIONS -jar /app/app.jar"]
    