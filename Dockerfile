FROM node:23.7-alpine
WORKDIR /app
# install vite globally
RUN npm install -g vite
# copy all filtes
COPY . .
# install all deps
RUN yarn install

# vite default port
EXPOSE 5173
CMD ["yarn", "run", "dev"]