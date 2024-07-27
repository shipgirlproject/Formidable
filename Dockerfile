FROM node:lts-alpine

LABEL org.opencontainers.image.source = "https://github.com/shipgirlproject/Formidable"

RUN addgroup -g 900 formidable && \
    adduser -S -u 900 -G formidable formidable

WORKDIR /home/formidable

COPY . /home/formidable

RUN mkdir -p /home/formidable && \
    chown -R formidable:formidable /home/formidable

USER formidable

RUN npm install

ENTRYPOINT ["npm", "run", "dev"]