FROM node:20-alpine AS builder

WORKDIR /app

# Instalar dependências necessárias para compilação
RUN apk add --no-cache openssl libc6-compat

COPY package*.json ./
COPY prisma ./prisma/

RUN npm install

COPY tsconfig.json ./
COPY src ./src

RUN npx prisma generate
RUN npm run build

FROM node:20-alpine AS runner

WORKDIR /app

RUN apk add --no-cache openssl libc6-compat

ENV NODE_ENV=production
ENV PORT=3000
ENV HOST=0.0.0.0

COPY package*.json ./
COPY prisma ./prisma/

RUN npm install --omit=dev
RUN npx prisma generate

COPY --from=builder /app/dist ./dist

EXPOSE 3000

# Executa migrações/push e inicia o servidor
CMD ["sh", "-c", "npx prisma db push && npx tsx prisma/seed.ts && node dist/server.js"]
