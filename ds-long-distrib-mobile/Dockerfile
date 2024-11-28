FROM nginx:mainline-alpine

COPY ./dist /data 

RUN rm /etc/nginx/conf.d/default.conf

ADD admin-nginx.conf /etc/nginx/conf.d/ 

