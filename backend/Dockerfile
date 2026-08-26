FROM node:22-alpine AS dependencies

WORKDIR /app

COPY package.json ./

RUN npm install --omit=dev --legacy-peer-deps --no-audit --no-fund \
    && npm cache clean --force \
    && rm -rf /root/.npm /tmp/*

COPY prisma ./prisma

RUN npx prisma generate \
    && npm cache clean --force \
    && rm -rf /root/.npm /tmp/*

FROM node:22-alpine AS runtime

WORKDIR /app

ENV NODE_ENV=production

COPY --from=dependencies /app/node_modules ./node_modules

COPY . .

EXPOSE 5000

CMD ["node", "server.js"]
