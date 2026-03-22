# 1. Mərhələ: Build
FROM maven:3.9.6-eclipse-temurin-17-alpine AS builder
WORKDIR /app
COPY . .
RUN mvn clean package -DskipTests

# 2. Mərhələ: Run
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
COPY --from=builder /app/target/*.jar app.jar

# Render üçün portu mütləq qeyd edirik
ENV PORT=8080
EXPOSE 8080

# Java-ya deyirik ki, məhz bu portu dinləsin
ENTRYPOINT ["java", "-Dserver.port=${PORT}", "-jar", "app.jar"]
