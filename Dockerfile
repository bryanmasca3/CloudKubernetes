FROM node:14

WORKDIR /cloudl-server

COPY package.json ./

RUN npm install

COPY . .

EXPOSE 5000

CMD ["npm", "start"]
