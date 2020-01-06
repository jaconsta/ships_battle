FROM node:10 AS builder

# RUN npm install -g yarn

# Dependencies
WORKDIR /app/
COPY package.json yarn.lock ./
RUN yarn

COPY . ./

# Run development
# Uncomment and comment below if you want only development.
EXPOSE 3000
ENTRYPOINT ["yarn", "start"]

# RUN yarn run build
