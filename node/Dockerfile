FROM node:20

WORKDIR /node

COPY package*.json ./

RUN npm install

COPY . .

ENV PORT=8080

EXPOSE 8080

#CMD [ "npm", "run", "start.dev" ]
# Startup script waits for the db before launching
CMD ["./wait-for-it.sh", "pms-db:5432", "--", "npm", "run", "start.dev"]
