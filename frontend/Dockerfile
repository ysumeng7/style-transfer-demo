FROM node:12.8-alpine as build-deps
WORKDIR /usr/src/app
COPY . ./
RUN yarn --network-timeout 100000 install
RUN yarn build

FROM nginx:1.17-alpine
COPY --from=build-deps /usr/src/app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
