#!/bin/bash

cd /home/ryukim/deploy/42_checkIn
cp -rf /home/ubuntu/.env /home/ubuntu/deploy/42_checkIn/server/

docker build -t 42checkIn .
./deploy.sh > /dev/null 2> /dev/null < /dev/null &
