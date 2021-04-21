FROM node:12.18

MAINTAINER RyunYeongKim <rycando@naver.com>

VOLUME /home/ryukim/deploy/42_checkIn

COPY ./start.sh /usr/local/bin

RUN ln -s /usr/local/bin/start.sh /start.sh

# CMD ["start.sh"]