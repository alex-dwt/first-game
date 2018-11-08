# base image
FROM node:11.1.0-alpine

# set working directory
WORKDIR /app/src

# add `/usr/src/app/node_modules/.bin` to $PATH
ENV PATH /app/src/node_modules/.bin:$PATH

# install and cache app dependencies
##COPY package.json /usr/src/app/package.json
#RUN npm install
# add app
#COPY . /usr/src/app

