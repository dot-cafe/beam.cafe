### Build stage for the website frontend
FROM node:latest as build-stage

WORKDIR /frontend

# Copy repository content
COPY . .

# install dependency
RUN npm install

# Build the application for deployment
RUN npm run build

### Server
FROM node:current-alpine

WORKDIR /app

# Copy the final build for the frontend and backend
COPY --from=build-stage /frontend /frontend

# Open port 8080
EXPOSE 3000

# Command to start the server
CMD npm run start
