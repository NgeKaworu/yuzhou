FROM node:lts-alpine as builder

RUN mkdir -p /home/node/app && \
    chown node:node /home/node/app

USER node

WORKDIR /home/node/app

COPY --chown=node:node package.json package-lock.json yarn.lock ./
RUN yarn --frozen-lockfile --registry=http://registry.npmmirror.com

COPY --chown=node:node . .

RUN yarn build

FROM nginx:stable-alpine


EXPOSE 80

COPY --from=builder /home/node/app/dist /usr/share/nginx/html
COPY ./nginx.conf /etc/nginx/conf.d/default.conf
