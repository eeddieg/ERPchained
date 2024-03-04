FROM node:16
RUN npm i -g express
RUN apt-get update && apt-get install -y openssl
# RUN mkdir backend
WORKDIR /backend
ADD prisma /backend/prisma
COPY package*.json ./
RUN npm i
# RUN npm run dbReset
# RUN npm i && npm run dbReset
# RUN npm i && npx prisma generate && npx prisma db push && npx prisma db seed
# RUN npm i && npm run dbReset
COPY . .
EXPOSE 3000
CMD ["npm", "run", "dev"]