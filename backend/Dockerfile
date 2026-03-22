# Java 17 (və ya sizin istifadə etdiyiniz versiya)
FROM openjdk:17-jdk-slim

# İş qovluğu
WORKDIR /app

# Maven və ya Gradle ilə yaradılan .jar faylını konteynerə kopyalayırıq
# Qeyd: 'target' qovluğunda .jar faylının olduğundan əmin olun
COPY target/*.jar app.jar

# Portu açırıq (Spring Boot adətən 8080-də işləyir)
EXPOSE 8080

# Proqramı işə salırıq
ENTRYPOINT ["java", "-jar", "app.jar"]
