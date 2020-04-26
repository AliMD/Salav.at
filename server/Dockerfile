FROM node:13-alpine

# Create app directory
WORKDIR /app

# Install app dependencies
COPY package.json .

# Install dependency
RUN npm install

# Bundle app source
COPY build/ ./

EXPOSE 8080

CMD prpl-server --host 0.0.0.0 --port 8080
