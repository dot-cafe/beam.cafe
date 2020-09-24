FROM node:12

# Use app as working directory
WORKDIR /app

# Copy repository content
COPY . .

# Install dependencies
RUN npm install

# Build app
ENTRYPOINT npm run build
