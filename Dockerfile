# Use official Node.js image
FROM node:18

# Set working directory inside container
WORKDIR /app

# Copy everything into container
COPY . .

# Install dependencies
RUN npm install

# Run the bot
CMD ["node", "bot.js"]
