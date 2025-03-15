# Use Node.js base image
FROM node:18

# Set the working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package.json yarn.lock ./
RUN yarn install

# Copy the rest of the project files
COPY . .

# Expose the port Next.js runs on
EXPOSE 3000

# Start the application
CMD ["yarn", "start"]
