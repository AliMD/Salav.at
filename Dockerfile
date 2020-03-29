FROM node:13-alpine

# Create app directory
WORKDIR /app

# Install app dependencies
COPY package.json yarn.lock ./

# Install dependency
RUN yarn install

# Bundle app source
COPY . .

# Build project
RUN yarn build

EXPOSE 8080

CMD yarn serve