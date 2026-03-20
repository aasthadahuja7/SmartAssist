FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Expose the port Vite runs on (default is 5173)
EXPOSE 5173

# Start the application and bind to all network interfaces so it's accessible from outside the container
CMD ["npm", "run", "dev", "--", "--host"]
