FROM node:18-alpine3.18

WORKDIR /app

COPY package*.json .
RUN npm install
COPY . .

ENV MONGO_URL=mongodb://db/ieducate

EXPOSE 5000

CMD ["npm", "start"]