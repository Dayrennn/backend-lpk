# versi node js
FROM node:24 

# folder buat di docker
WORKDIR /app

# ambil dependency dari project
COPY package*.json ./

# ambil prisma dari project
COPY prisma ./prisma

# install dependency
RUN npm install

# salin source code ke /app
COPY . .

# generate prisma
RUN npx prisma generate

# port yang jalan sesuai server.js
EXPOSE 3000

# nantinya akan menjalan kan npm start
CMD ["npm", "run", "dev"]