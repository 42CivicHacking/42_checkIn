#!/bin/bash

cd /deploy/42_checkIn/server


npm install
npm install -g @nestjs/cli
npm install -g pm2
pm2 set pm2-slack:slack_url https://hooks.slack.com/services/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
pm2 set pm2-slack:servername 42CheckIn
pm2 set pm2-slack:start true
pm2 set pm2-slack:stop true
pm2 set pm2-slack:restart true
npm run build
pm2-runtime start ./dist/src/main.js