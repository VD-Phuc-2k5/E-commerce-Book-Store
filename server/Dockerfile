FROM node:18-alpine

LABEL \
  Name="server" \
  Version="1.0" \
  Description="Bookstore backend server"

WORKDIR /app/server

COPY ./package*.json ./
RUN yarn global add gatsby-cli
RUN yarn install

COPY .env .

COPY . .

EXPOSE 3000
CMD ["npm", "run", "dev"]
