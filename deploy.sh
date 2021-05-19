#!/bin/bash

DOCKER_APP_NAME=enter

EXIST_BLUE=$(docker-compose -p ${DOCKER_APP_NAME}-blue -f docker-compose.blue.yaml ps | grep Up)

if [ -z "$EXIST_BLUE" ]; then
    echo "blue up"
    docker-compose -p ${DOCKER_APP_NAME}-blue -f docker-compose.blue.yaml up -d
    sleep 60
    docker-compose -p ${DOCKER_APP_NAME}-green -f docker-compose.green.yaml down

else
    echo "green up"
    docker-compose -p ${DOCKER_APP_NAME}-green -f docker-compose.green.yaml up -d
    sleep 60
    docker-compose -p ${DOCKER_APP_NAME}-blue -f docker-compose.blue.yaml down

fi