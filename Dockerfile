FROM node:18

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma/

RUN npm i -g prisma

RUN npm install

COPY . .

RUN npm run build