FROM nginx:stable-alpine

EXPOSE 80

COPY  ./dist /usr/share/nginx/html
COPY ./nginx.conf /etc/nginx/conf.d/default.conf
