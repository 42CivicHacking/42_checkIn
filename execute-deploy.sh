#!/bin/bash

cd /home/ryukim/deploy/42_checkIn
cp -rf /home/ryukim/.env /home/ryukim/deploy/42_checkIn/server/

docker build -t enter .
./deploy.sh > /dev/null 2> /dev/null < /dev/null &
