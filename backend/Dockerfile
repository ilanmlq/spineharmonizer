FROM node:22-alpine

WORKDIR /app

RUN apk add --no-cache tzdata
ENV TZ=Europe/Paris

COPY package*.json ./
COPY prisma ./prisma

RUN npm install

COPY . .

RUN npx prisma generate
RUN npm run build

EXPOSE 3000

CMD ["sh", "-c", "npm run prisma:deploy && npm run dev"]