FROM node:20-alpine AS builder
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY web-server/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
