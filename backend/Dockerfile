FROM maven:3.9-eclipse-temurin-21 AS build
WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN mvn -B package -DskipTests
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
RUN apk add --no-cache --upgrade 'libexpat>=2.9.0-r0' && addgroup -S app && adduser -S app -G app && mkdir /data && chown app:app /data
COPY --from=build /app/target/*.jar app.jar
USER app
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
