FROM node:13-alpine

# Create app directory
WORKDIR /app

# Install app dependencies
COPY package-docker.json package.json

# Install dependency
RUN npm install

# Bundle app source
COPY dist/* ./

EXPOSE 8080

CMD yarn serve
