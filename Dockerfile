FROM nginx:1-alpine

WORKDIR /usr/share/nginx/html

COPY build/ .

RUN ls -lAhF
