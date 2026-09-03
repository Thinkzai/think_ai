FROM node:22-alpine AS build

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm ci \
    --legacy-peer-deps \
    --no-audit \
    --no-fund

COPY prisma ./prisma

RUN npx prisma generate

FROM node:22-alpine AS production-dependencies

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm ci \
    --omit=dev \
    --legacy-peer-deps \
    --no-audit \
    --no-fund \
    && npm cache clean --force \
    && rm -rf /root/.npm /tmp/*

FROM node:22-alpine AS runtime

WORKDIR /app

ENV NODE_ENV=production

COPY --from=production-dependencies /app/node_modules ./node_modules
COPY --from=build /app/node_modules/.prisma ./node_modules/.prisma
COPY . .

EXPOSE 5000

CMD ["node", "server.js"]
