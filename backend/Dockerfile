FROM node:22-alpine

WORKDIR /app

COPY package.json ./

RUN npm install --omit=dev --legacy-peer-deps

COPY . .

RUN npx prisma generate

EXPOSE 5000

CMD ["node", "server.js"]
