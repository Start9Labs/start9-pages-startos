#!/bin/bash

echo "Starting up..."

export HOST_IP=$(ip -4 route list match 0/0 | awk '{print $3}')

home_type=$(yq e '.homepage.type' start9/config.yaml)
subdomains=($(yq e '.subdomains.[].name' start9/config.yaml))
tor_address=($(yq e '.tor-address' start9/config.yaml))

bucket_size=64
for subdomain in "${subdomains[@]}"; do
    suffix=".${tor_address}"
    len=$(( ${#suffix} + ${#subdomain} ))
    if [[ $len -ge $bucket_size ]]; then
        bucket_size=$(( $bucket_size * 2 ))
    fi
done

if [[ $home_type = "index" ]]; then
    if [ ${#subdomains} -ne 0 ]; then
        cp /var/www/index/index-prefix.html /var/www/index/index.html
        for subdomain in "${subdomains[@]}"; do
            echo "      <li><a target=\"_blank\" href=\"http://${subdomain}.${tor_address}\">${subdomain}</a></li>" >> /var/www/index/index.html
        done
        cat /var/www/index/index-suffix.html >> /var/www/index/index.html
    else
        cp /var/www/index/empty.html /var/www/index/index.html
    fi
fi

echo "server_names_hash_bucket_size ${bucket_size};" > /etc/nginx/http.d/default.conf


if [[ $home_type = "redirect" ]]; then
    target=$(yq e '.homepage.target' start9/config.yaml)
    cat >> /etc/nginx/http.d/default.conf <<EOT
server {
  listen 80;
  listen [::]:80;
  server_name ${tor_address};
  return 301 http://${target}.${tor_address}$request_uri;
}
EOT
elif [[ $home_type = "web-page" ]]; then
    directory=$(yq e '.homepage.source.folder' start9/config.yaml)
    source=$(yq e '.homepage.source.type' start9/config.yaml)

    if ! test -d "/mnt/${source}"
    then
        echo "${source} mountpoint does not exist"
        exit 0
    fi
    cat >> /etc/nginx/http.d/default.conf <<EOT
server {
  autoindex on;
  listen 80;
  listen [::]:80;
  server_name ${tor_address};
  root "/mnt/${source}/${directory}";
}
EOT
else
    cat >> /etc/nginx/http.d/default.conf <<EOT
server {
  listen 80;
  listen [::]:80;
  server_name ${tor_address};
  root "/var/www/${home_type}";
}
EOT
fi

for subdomain in "${subdomains[@]}"; do
    subdomain_type=$(yq e ".subdomains.[] | select(.name == \"$subdomain\") | .settings |.type" start9/config.yaml)
    if [[ $subdomain_type == "web-page" ]]; then
        directory="$(yq e ".subdomains.[] | select(.name == \"$subdomain\") | .settings | .source | .folder" start9/config.yaml)"
        source="$(yq e ".subdomains.[] | select(.name == \"$subdomain\") | .settings | .source | .type" start9/config.yaml)"\
        
        if ! test -d "/mnt/${source}"
        then
            echo "${source} mountpoint does not exist"
            exit 0
        fi
        cat >> /etc/nginx/http.d/default.conf <<EOT
server {
  autoindex on;
  listen 80;
  listen [::]:80;
  server_name ${subdomain}.${tor_address};
  root "/mnt/${source}/${directory}";
}
EOT
    elif [ $subdomain_type = "redirect" ]; then
        if [ "$(yq e ".subdomains.[] | select(.name == \"$subdomain\") | .settings | .target == ~" start9/config.yaml)" = "true"]; then
            cat >> /etc/nginx/http.d/default.conf <<EOT
server {
  listen 80;
  listen [::]:80;
  server_name ${subdomain}.${tor_address};
  return 301 http://${tor_address}$request_uri;
}
EOT
        else
            target="$(yq e ".subdomains.[] | select(.name == \"$subdomain\") | .settings | .target" start9/config.yaml)"
            cat >> /etc/nginx/http.d/default.conf <<EOT
server {
  listen 80;
  listen [::]:80;
  server_name ${subdomain}.${tor_address};
  return 301 http://${target}.${tor_address}$request_uri;
}
EOT
        fi
    fi
done

echo "Start9 Pages initalized"

exec tini -- nginx -g "daemon off;"
