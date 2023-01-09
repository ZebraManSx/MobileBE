FROM node:18-alpine

COPY . .

WORKDIR ./dist

RUN "pwd"
RUN ls -l
RUN npm -v
RUN node -v


RUN npm install --verbose

RUN ls -l 

CMD ["node", "main"]