FROM node:12

# Use app as working directory
WORKDIR /app

# Copy repository content
COPY . .

# Build app
ENTRYPOINT npm install && \
           npm run build
