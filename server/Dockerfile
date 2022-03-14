FROM node:14.19-alpine3.15

RUN apk add bash

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000


#RUN npx prisma generate


CMD ["bash", "-c", "npx prisma generate ; npx prisma migrate deploy ; node index.js"]