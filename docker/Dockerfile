FROM node:latest
MAINTAINER Armagan Amcalar "armagan@amcalar.com"

RUN npm install -g pm2@latest
RUN git clone https://github.com/Purdue-ACM-SIGAPP/PurdueLaundry-server.git
RUN git checkout jeff-path-changes
WORKDIR /purdue-laundry-api

RUN npm install

ENV PORT=80
CMD pm2 start app.js -i 0 --name "api" --no-daemon


EXPOSE 80
