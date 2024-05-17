FROM node:18

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

CMD [ "./docker-entrypoint.sh", "npm", "run", "start" ]