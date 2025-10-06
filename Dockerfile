FROM mcr.microsoft.com/devcontainers/javascript-node:1-22-bookworm

WORKDIR /app

COPY package*.json ./

# Install Node.js and npm
RUN apt-get update && \
    apt-get install -y nodejs npm

COPY . .

EXPOSE 3000

CMD ["npm", "start"]