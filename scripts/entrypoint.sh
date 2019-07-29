#!/bin/ash
yarn delete-partners
printf "\n\n======================================\n"
printf "Run database migrations"
printf "\n======================================\n\n"
yarn migrations

printf "\n\n======================================\n"
printf "Start the application"
printf "\n======================================\n\n"
node ./build/index.js
