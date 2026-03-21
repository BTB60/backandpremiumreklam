# 1. Java mühiti
FROM eclipse-temurin:17-jdk-alpine

# 2. İşçi qovluğu
WORKDIR /app

# 3. Faylları kopyala
COPY . .

# 4. Proqramı yığ (Build)
RUN chmod +x gradlew
RUN ./gradlew bootJar -x test

# 5. Port
EXPOSE 8080

# 6. Proqramı birbaşa işə sal (Ən dəqiq yol)
ENTRYPOINT ["java", "-jar", "build/libs/premium-reklam-backend-1.0.0.jar"]
