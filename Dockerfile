FROM node:22-alpine AS frontend
WORKDIR /frontend
COPY frontend/package*.json ./
RUN npm ci
COPY frontend/ ./
ENV VITE_USE_REAL_API=true
ENV VITE_API_BASE_URL=/api
RUN npm run build

FROM maven:3.9-eclipse-temurin-21 AS backend
WORKDIR /backend
COPY backend/pom.xml ./
COPY backend/src ./src
COPY --from=frontend /frontend/dist ./src/main/resources/static
RUN mvn -B package -DskipTests

FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
RUN apk upgrade --no-cache && apk add --no-cache su-exec && addgroup -S app && adduser -S app -G app && mkdir /data && chown app:app /data
COPY --from=backend /backend/target/*.jar app.jar
COPY deploy/start-service.sh /app/start-service.sh
RUN chmod +x /app/start-service.sh
ENV JAVA_TOOL_OPTIONS="-XX:MaxRAMPercentage=60.0 -XX:+ExitOnOutOfMemoryError"
EXPOSE 8080
ENTRYPOINT ["/app/start-service.sh"]
