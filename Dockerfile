FROM node:12.18.3-stretch

# Use app as working directory
WORKDIR /app

# Copy repository content
COPY . .

# Install dependencies
RUN npm install

# Build frontend
ENTRYPOINT npm run build
