FROM fholzer/nginx-brotli

RUN \
  addgroup -g 33 nextcloud-data && \
  addgroup -g 1000 filebrowser-data && \
  adduser nginx nextcloud-data && \
  adduser nginx filebrowser-data