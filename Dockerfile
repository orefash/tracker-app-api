FROM node:16.15-alpine3.14
RUN mkdir -p /opt/loan-app
WORKDIR /opt/loan-app
COPY package*.json ./
RUN npm install
RUN npm install --save pm2
COPY . .
EXPOSE 5002
CMD [ "npm", "run", "pm2" ]