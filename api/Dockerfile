FROM node:20-slim

# Install OpenSSL and other dependencies needed by Prisma
RUN apt-get update -y && apt-get install -y openssl

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN mkdir -p uploads
RUN npx prisma generate

EXPOSE 4821

CMD ["npm", "run", "dev:migrate"]
