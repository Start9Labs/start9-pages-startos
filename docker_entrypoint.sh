#!/bin/bash

export HOST_IP=$(ip -4 route list match 0/0 | awk '{print $3}')

subdomains=($(yq r start9/config.yaml 'sites.*.subdomain'))
directories=($(yq r start9/config.yaml 'sites.*.directory'))

bucket_size=64
for subdomain in "${subdomains[@]}"; do
    len=$(( 62 + ${#subdomain} ))
    if [ $len -ge $bucket_size ]; then
        bucket_size=$(( $bucket_size * 2 ))
    fi
done

mkdir -p /root/landing
if [ ${#subdomains} -eq 0 ]; then
    echo "<html>" > /root/landing/index.html
    echo "  <head>" >> /root/landing/index.html
    echo "    <title>Embassy Pages</title>" >> /root/landing/index.html
    echo "  </head>" >> /root/landing/index.html
    echo "  <body>" >> /root/landing/index.html
    echo "    <h1>Welcome to Embassy Pages</h1>" >> /root/landing/index.html
    echo "    <p>Looks like you don't have any sites yet. Start by adding a site to your config.</p>" >> /root/landing/index.html
    echo "  </body>" >> /root/landing/index.html
    echo "</html>" >> /root/landing/index.html
else
    echo "<html>" > /root/landing/index.html
    echo "  <head>" >> /root/landing/index.html
    echo "    <title>Embassy Pages</title>" >> /root/landing/index.html
    echo "  </head>" >> /root/landing/index.html
    echo "  <body>" >> /root/landing/index.html
    echo "    <h1>Available Sites</h1>" >> /root/landing/index.html
    echo "    <ul>" >> /root/landing/index.html
    for subdomain in "${subdomains[@]}"; do
        echo "      <li><a href=\"http://$subdomain.$TOR_ADDRESS\">$subdomain</a></li>" >> /root/landing/index.html
    done
    echo "    </ul>" >> /root/landing/index.html
    echo "  </body>" >> /root/landing/index.html
    echo "</html>" >> /root/landing/index.html
fi

echo "server_names_hash_bucket_size ${bucket_size};" > /etc/nginx/conf.d/default.conf
echo "server {" >> /etc/nginx/conf.d/default.conf
echo "  listen 80;" >> /etc/nginx/conf.d/default.conf
echo "  listen [::]:80;" >> /etc/nginx/conf.d/default.conf
echo "  server_name $TOR_ADDRESS;" >> /etc/nginx/conf.d/default.conf
echo "  root \"/root/landing\";" >> /etc/nginx/conf.d/default.conf
echo "}" >> /etc/nginx/conf.d/default.conf

for ((i=0; i<${#subdomains[@]}; i++)); do
    subdomain=${subdomains[$i]}
    directory=${directories[$i]}
    echo "server {" >> /etc/nginx/conf.d/default.conf
    echo "  autoindex on;" >> /etc/nginx/conf.d/default.conf
    echo "  listen 80;" >> /etc/nginx/conf.d/default.conf
    echo "  listen [::]:80;" >> /etc/nginx/conf.d/default.conf
    echo "  server_name $subdomain.$TOR_ADDRESS;" >> /etc/nginx/conf.d/default.conf
    echo "  root \"/root/start9/public/filebrowser/$directory\";" >> /etc/nginx/conf.d/default.conf
    echo "}" >> /etc/nginx/conf.d/default.conf
done

exec tini -- nginx -g "daemon off;"
