# base image
FROM node:11.1.0-alpine

# set working directory
RUN mkdir /usr/src/my-app
WORKDIR /usr/src/my-app

# add `/usr/src/app/node_modules/.bin` to $PATH
ENV PATH /usr/src/app/node_modules/.bin:$PATH

# install and cache app dependencies
##COPY package.json /usr/src/app/package.json
#RUN npm install
# add app
#COPY . /usr/src/app

