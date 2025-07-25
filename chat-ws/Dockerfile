# Use official Node.js LTS image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install --production

# Copy the rest of the app
COPY . .

# Expose port 80 (mapped to 3000 in the app)
EXPOSE 80

# Start the app
CMD ["sh", "-c", "PORT=80 node index.js"]
