FROM node:lts-alpine

LABEL org.opencontainers.image.source = "https://github.com/shipgirlproject/Formidable"

WORKDIR /home/node/app

COPY . .

RUN npm install

ENTRYPOINT ["npm", "start"]