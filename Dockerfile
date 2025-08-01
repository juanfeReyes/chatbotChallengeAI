# Use official Node.js LTS image
FROM node:20-alpine

# Set working directory
WORKDIR /app
COPY . .
# Install dependencies
RUN cd chat-ui && npm install
RUN cd chat-ws && npm install

# Build app
RUN cd chat-ui && npm run build
RUN cd chat-ws && node ./scripts/build_app.js


# Expose port 8080
EXPOSE 8080
ENV CHATWS_PORT="8080"

# Start the app
CMD ["sh", "-c", "cd chat-ws && npm run start"]
