ARG COMMIT_SHA=""

FROM node:alpine AS builder
WORKDIR /app

RUN npm i -g pnpm
COPY pnpm-lock.yaml package.json ./
COPY ./patches/ ./patches/

RUN pnpm get registry
RUN pnpm config set registry https://registry.npmmirror.com
RUN pnpm i

COPY . .
RUN pnpm build

FROM alpine

RUN sed -i 's/dl-cdn.alpinelinux.org/mirrors.tuna.tsinghua.edu.cn/g' /etc/apk/repositories
RUN apk add \
  nginx \
  nginx-mod-http-brotli
COPY docker/nginx-default.conf /etc/nginx/http.d/default.conf
RUN rm -rf /usr/share/nginx/html/*
COPY --from=builder /app/public /usr/share/nginx/html
ENV YACD_DEFAULT_BACKEND "http://127.0.0.1:9090"
ADD docker-entrypoint.sh /
CMD ["/docker-entrypoint.sh"]
