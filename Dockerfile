# LEGACY / kök mono-repo ilə uyğun deyil — bu repoda pom.xml və Java src kökdə yoxdur (bax: backend/).
# Docker ilə build üçün: backend/Dockerfile və ya backend/docker-compose.yml
# Hostinger KVM VPS (Ubuntu): DEPLOY_GUIDE.md §7 — deploy/install-vps.sh

FROM maven:3.9-openjdk-17-slim AS builder
WORKDIR /app
COPY pom.xml .
RUN mvn dependency:go-offline -B
COPY src ./src
RUN mvn package -DskipTests -B

FROM openjdk:17-slim
WORKDIR /app
COPY --from=builder /app/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
