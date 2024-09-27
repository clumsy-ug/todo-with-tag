FROM node:20-alpine AS base

# コンテナ内の作業ディレクトリ
WORKDIR /app

COPY package.json package-lock.json* ./

RUN npm ci

CMD ["npm", "run", "dev"]
