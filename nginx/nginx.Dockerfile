FROM nginx
RUN "pwd"

# Override the default nginx configuration file
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/nginx.conf

RUN ls -l

CMD ["nginx", "-g", "daemon off;"]