FROM node:16-alpine

WORKDIR /usr/src/app

# Copy package files for dependency installation
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy app source code
COPY . .

# Expose port
EXPOSE 5000

# Command to run the app
CMD ["node", "server.js"]