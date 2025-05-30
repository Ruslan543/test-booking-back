# FROM node:18
# WORKDIR /app

# COPY package*.json ./
# RUN npm install

# COPY . .

# RUN npm run build
# EXPOSE 4000
# CMD ["node", "dist/main"]

FROM node:18

# Set working directory
WORKDIR /app

# Copy package definitions and install dependencies
COPY package*.json ./
RUN npm install

# Copy all application files
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build the application
RUN npm run build

# Expose the application port
EXPOSE 4000

# On container start: run migrations then launch the app
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/main"]