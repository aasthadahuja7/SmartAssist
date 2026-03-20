FROM node:20-alpine

# Create app directory
WORKDIR /app

# Install app dependencies
COPY package*.json ./
RUN npm install

# Bundle app source code
COPY . .

# Expose the API port
EXPOSE 5001

# Start the server!
CMD ["node", "server.js"]
