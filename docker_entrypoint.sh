#!/bin/bash

export HOST_IP=$(ip -4 route list match 0/0 | awk '{print $3}')

echo start9/public > .backupignore
echo start9/shared >> .backupignore

home_type=$(yq e '.homepage.type' start9/config.yaml)
subdomains=($(yq e '.subdomains.[].subdomain' start9/config.yaml))

read -r -d "" build_site_desc <<EOT
{
    "description": "Subdomain link for the site " + .,
    "masked": false,
    "copyable": true,
    "qr": false,
    "type": "string",
    "value": . + ".$TOR_ADDRESS"
}
EOT

yq e ".subdomains.[].subdomain | {.: $build_site_desc}" start9/config.yaml > start9/stats.yaml
yq e -i '{"data": .}' start9/stats.yaml
yq e -i '.version = 2' start9/stats.yaml
if [ ! -s start9/stats.yaml ] ; then
    rm start9/stats.yaml
fi

bucket_size=64
for subdomain in "${subdomains[@]}"; do
    len=$(( 62 + ${#subdomain} ))
    if [[ $len -ge $bucket_size ]]; then
        bucket_size=$(( $bucket_size * 2 ))
    fi
done

if [[ $home_type = "index" ]] && [ ${#subdomains} -ne 0 ]; then
    cp /var/www/index/index-prefix.html /var/www/index/index.html
    for subdomain in "${subdomains[@]}"; do
        echo "      <li><a href=\"http://${subdomain}.${TOR_ADDRESS}\">${subdomain}</a></li>" >> /var/www/home/index.html
    done
    cat /var/www/index/index-suffix.html >> /var/www/index/index.html
fi

echo "server_names_hash_bucket_size ${bucket_size};" > /etc/nginx/conf.d/default.conf

if [[ $home_type = "redirect" ]]; then
    target=$(yq e '.homepage.target' start9/config.yaml)
    cat >> /etc/nginx/conf.d/default.conf <<EOT
server {
  listen 80;
  listen [::]:80;
  server_name ${TOR_ADDRESS};
  return 301 http://${target}.${TOR_ADDRESS}$request_uri;
}
EOT
elif [[ $home_type = "filebrowser" ]]; then
    directory=$(yq e '.homepage.directory' start9/config.yaml)
    cat >> /etc/nginx/conf.d/default.conf <<EOT
server {
  autoindex on;
  listen 80;
  listen [::]:80;
  server_name ${TOR_ADDRESS};
  root "/root/start9/public/filebrowser/${directory}";
}
EOT
else
    cat >> /etc/nginx/conf.d/default.conf <<EOT
server {
  listen 80;
  listen [::]:80;
  server_name ${TOR_ADDRESS};
  root "/var/www/${home_type}";
}
EOT
fi

for subdomain in "${subdomains[@]}"; do
    subdomain_type=$(yq e ".subdomains.[] | select(.subdomain == \"$subdomain\") | .type" start9/config.yaml)
    if [[ $subdomain_type == "filebrowser" ]]; then
        directory="$(yq e ".subdomains.[] | select(.subdomain == \"$subdomain\") | .directory" start9/config.yaml)"
        cat >> /etc/nginx/conf.d/default.conf <<EOT
server {
  autoindex on;
  listen 80;
  listen [::]:80;
  server_name ${subdomain}.${TOR_ADDRESS};
  root "/root/start9/public/filebrowser/${directory}";
}
EOT
    elif [[ $home_type = "redirect" ]]; then
        if [ "$(yq e ".subdomains.[] | select(.subdomain == \"$subdomain\") | .target == ~" start9/config.yaml)" = "true"]; then
            cat >> /etc/nginx/conf.d/default.conf <<EOT
server {
  listen 80;
  listen [::]:80;
  server_name ${subdomain}.${TOR_ADDRESS};
  return 301 http://${TOR_ADDRESS}$request_uri;
}
EOT
        else
            target="$(yq e ".subdomains.[] | select(.subdomain == \"$subdomain\") | .target" start9/config.yaml)"
            cat >> /etc/nginx/conf.d/default.conf <<EOT
server {
  listen 80;
  listen [::]:80;
  server_name ${subdomain}.${TOR_ADDRESS};
  return 301 http://${target}.${TOR_ADDRESS}$request_uri;
}
EOT
        fi
    fi
done

exec tini -- nginx -g "daemon off;"
