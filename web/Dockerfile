FROM node:10
WORKDIR /Users/bhodgs/Documents/SIT209/Project/TrackMe/web
COPY package.json .
RUN npm install
COPY . .
EXPOSE 3000
CMD node server.js
