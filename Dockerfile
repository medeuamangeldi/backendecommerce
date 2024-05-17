FROM node:18

WORKDIR /

COPY package*.json ./

RUN npm install

COPY . .

RUN npx migrate dev

RUN npm run build

CMD [ "npm", "run", "start" ]