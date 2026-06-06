FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN mkdir -p uploads
RUN npx prisma generate

EXPOSE 4821

CMD ["npm", "run", "dev:migrate"]
