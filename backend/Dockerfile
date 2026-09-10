FROM node:20-alpine AS build

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm ci \
    --legacy-peer-deps \
    --no-audit \
    --no-fund

COPY prisma ./prisma

RUN npx prisma generate

FROM node:20-alpine AS production-dependencies

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm ci \
    --omit=dev \
    --legacy-peer-deps \
    --no-audit \
    --no-fund \
    && npm cache clean --force \
    && rm -rf /root/.npm /tmp/*

FROM node:20-alpine AS runtime

WORKDIR /app

ENV NODE_ENV=production

COPY --chown=1001:1001 --from=production-dependencies /app/node_modules ./node_modules
COPY --chown=1001:1001 --from=build /app/node_modules/.prisma ./node_modules/.prisma
COPY --chown=1001:1001 . .

RUN addgroup -S -g 1001 appgroup
RUN adduser -S -D -u 1001 -G appgroup appuser
USER appuser
EXPOSE 5000

CMD ["node", "server.js"]
