FROM node:12.18

MAINTAINER RyunYeongKim <rycando@naver.com>

VOLUME /deploy/42_checkIn

# COPY ./start.sh /usr/local/bin

# RUN ln -s /usr/local/bin/start.sh /start.sh

WORKDIR /deploy/42_checkIn/server

RUN npm install
RUN npm install -g @nestjs/cli
RUN npm install -g pm2
RUN pm2 set pm2-slack:slack_url https://hooks.slack.com/services/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 && pm2 set pm2-slack:servername 42CheckIn

CMD ["pm2-runtime", "start"]