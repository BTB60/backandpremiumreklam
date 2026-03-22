# 1. Mərhələ: Build
FROM maven:3.9.6-eclipse-temurin-17-alpine AS builder
WORKDIR /app
COPY . .
RUN mvn clean package -DskipTests

# 2. Mərhələ: Run
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
COPY --from=builder /app/target/*.jar app.jar

# Portu 10000 olaraq təyin edirik (Render-in standartı budur)
ENV PORT=10000
EXPOSE 10000

# Spring Boot-a portu məcburi mənimsədirik
ENTRYPOINT ["java", "-Dserver.port=${PORT}", "-jar", "app.jar"]
