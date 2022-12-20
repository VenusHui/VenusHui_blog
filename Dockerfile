FROM nginx
COPY ./out /usr/share/nginx/html
EXPOSE 3000