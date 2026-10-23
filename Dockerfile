FROM alpine:3.24

RUN apk add --no-cache nginx nginx-mod-http-brotli && \
  ln -sf /dev/stdout /var/log/nginx/access.log && \
  ln -sf /dev/stderr /var/log/nginx/error.log && \
  addgroup -g 33 nextcloud-data && \
  addgroup -g 1000 filebrowser-data && \
  adduser nginx nextcloud-data && \
  adduser nginx filebrowser-data
