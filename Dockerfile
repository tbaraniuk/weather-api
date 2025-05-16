FROM node:18

RUN npm install -g pnpm

WORKDIR /app

COPY package*.json ./

COPY pnpm-lock.yaml ./

RUN pnpm install

COPY . .

RUN pnpm run build

CMD [ "pnpm", "run", "start:dev" ]