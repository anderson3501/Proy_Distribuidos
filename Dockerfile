FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN apk add --no-cache build-base python3 g++ make
RUN npm install
COPY . .
CMD ["npm", "start"]
