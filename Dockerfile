#Define image to build from
FROM node:alpine

LABEL AUTHOR="Dominic Motuka <dominic.motuka@andela.com>"
LABEL app="esa-backend"

#Create directory to hold the application code inside the image
#Working directory of the application
WORKDIR /usr/src/app

#Install app dependencies using npm binary
COPY package*.json /usr/src/app/
#COPY docs /usr/src/app/docs/
COPY db /usr/src/app/db/
COPY server /usr/src/app/server/
COPY .sequelizerc /usr/src/app/
COPY .babelrc /usr/src/app/
COPY templates /usr/src/app/templates/
COPY scripts/entrypoint.sh /usr/src/app/scripts/entrypoint.sh

RUN yarn install

# Uncomment this when using the application locally
#COPY .env .

#Bundle apps source code
RUN yarn build

ENV NODE_ENV=staging
ENV PORT=6050

# app binds to port 6050 so you'll use the EXPOSE
# instruction to have it mapped by the docker daemon:
EXPOSE 6050

# Use entrypoint shell script to run the migrations the start the application
RUN chmod +x /usr/src/app/scripts/entrypoint.sh
ENTRYPOINT ["/usr/src/app/scripts/entrypoint.sh"]
