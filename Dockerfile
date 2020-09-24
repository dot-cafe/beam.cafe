FROM node:12-alpine
LABEL maintainer="Simon Reinisch <contact@reinisch.io>"

# Use app as working directory
WORKDIR /app

# Copy repository content
COPY . .

# Install dependencies
RUN npm install

# Build app
ENTRYPOINT npm run build
