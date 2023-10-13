FROM node:16.20.1
WORKDIR /user
COPY package*.json .
RUN npm ci
COPY . .
# cmd to start application
CMD ["npm", "start"]
