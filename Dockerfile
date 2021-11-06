FROM node:14.16.0 AS builder

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm set progress=false && CYPRESS_INSTALL_BINARY=0 npm ci

ADD . .

RUN npx prisma generate

RUN npm run build

CMD ["/usr/local/bin/npm", "run", "start"]

EXPOSE 3000