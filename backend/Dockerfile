# Build
FROM eclipse-temurin:21-jdk AS builder
WORKDIR /app

# Copy wrapper and build
COPY gradlew gradlew
COPY gradlew.bat gradlew.bat
COPY gradle gradle
COPY settings.gradle build.gradle gradle.properties ./

# Copy source code
COPY src src

# Generate .jar
RUN chmod +x gradlew && \
    ./gradlew clean bootJar --no-daemon -x test

# Runtime w/ JRE
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

# Copy .jar
COPY --from=builder /app/build/libs/*.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
