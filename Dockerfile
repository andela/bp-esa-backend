#Define image to build from
FROM node:carbon

LABEL AUTHOR="Dominic Motuka <dominic.motuka@andela.com>"
LABEL app="esa-backend"

#Create directory to hold the application code inside the image
#Working directory of the application
WORKDIR /usr/src/app

#Install app dependencies using npm binary
COPY package*.json ./

RUN npm install
# When building  for production
# RUN npm install --only=production

#Bundle apps source code
COPY . .


# app binds to port 8000 so you'll use the EXPOSE
# instruction to have it mapped by the docker daemon:
EXPOSE 8000

# define the command to run your app using 
# CMD which defines your runtime

CMD [ "npm", "start" ]