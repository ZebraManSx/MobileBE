FROM  node:14.1.0-alpine

COPY . .

WORKDIR ./dist

RUN "pwd"
RUN ls -l
RUN npm -v
RUN node -v


RUN npm install --verbose

RUN ls -l


CMD [ "npm", "start" ]