FROM node:20-alpine

WORKDIR /app

COPY package.json .
COPY index.js .
COPY public ./public

RUN npm install

EXPOSE 3000

CMD ["node", "index.js"] 