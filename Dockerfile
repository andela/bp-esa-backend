#Define image to build from
FROM node:alpine

LABEL AUTHOR="Dominic Motuka <dominic.motuka@andela.com>"
LABEL app="esa-backend"

#Create directory to hold the application code inside the image
#Working directory of the application
WORKDIR /usr/src/app

#Install app dependencies using npm binary
COPY package*.json ./

RUN npm install --production
# When building  for production
# RUN npm install --only=production

#Bundle apps source code
COPY build ./build
COPY docs ./docs

# Uncomment this when using the application locally
# COPY .env .


# app binds to port 6050 so you'll use the EXPOSE
# instruction to have it mapped by the docker daemon:
EXPOSE 6050

# define the command to run your app using 
# CMD which defines your runtime

CMD [ "node", "./build/index.js" ]
