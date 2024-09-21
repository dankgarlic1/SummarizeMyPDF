# Use the official Node.js image as the base image
FROM node:18.17.1

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application files
COPY . .

# Expose the port your app runs on
EXPOSE 3000

# Command to run the app in development mode
CMD ["npm", "run", "dev"]
