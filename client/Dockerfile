FROM node:18-alpine

LABEL \
  Name="client" \
  Version="1.0" \
  Description="Bookstore client app"

WORKDIR /app/client

COPY ./package*.json ./
RUN yarn global add gatsby-cli
RUN yarn install

COPY . .

EXPOSE 5173
CMD ["npm", "run", "dev"]