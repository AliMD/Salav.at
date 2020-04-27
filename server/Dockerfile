FROM node:13-alpine

# Create app directory
WORKDIR /app

# Install app dependencies
COPY package.json .

# Install dependency
RUN yarn install --network-timeout 5000 --no-lockfile  --non-interactive --no-progress && yarn cache clean

# Bundle app source
COPY build/ ./

EXPOSE 8080

CMD yarn start
