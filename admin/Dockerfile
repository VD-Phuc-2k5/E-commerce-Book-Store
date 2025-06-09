FROM node:18-alpine

LABEL \
  Name="admin" \
  Version="1.0" \
  Description="Admin dashboard for bookstore"

WORKDIR /app/admin

COPY ./package*.json ./
RUN yarn global add gatsby-cli
RUN yarn install

COPY . .

EXPOSE 5174
CMD ["npm", "run", "dev"]
