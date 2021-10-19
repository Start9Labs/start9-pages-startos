#!/bin/bash

export HOST_IP=$(ip -4 route list match 0/0 | awk '{print $3}')

home_type=$(yq e '.homepage.type' start9/config.yaml)
subdomains=($(yq e '.subdomains.[].name' start9/config.yaml))
tor_address=($(yq e '.tor-address' start9/config.yaml))

read -r -d "" build_site_desc <<EOT
{
    "description": "Subdomain link for the site " + .,
    "masked": false,
    "copyable": true,
    "qr": false,
    "type": "string",
    "value": . + ".$tor_address"
}
EOT
yq e ".subdomains.[].name | {.: $build_site_desc}" start9/config.yaml > start9/stats.yaml
yq e -i '{"value": . }' start9/stats.yaml
yq e -i '.type="object"' start9/stats.yaml
yq e -i '.description="The available subdomains."' start9/stats.yaml
yq e -i '{"Subdomains": . }' start9/stats.yaml
yq e -i '{"data": .}' start9/stats.yaml
yq e -i '.version = 2' start9/stats.yaml
if [ ! -s start9/stats.yaml ] ; then
    rm start9/stats.yaml
fi

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
elif [[ $home_type = "filebrowser" ]]; then
    directory=$(yq e '.homepage.directory' start9/config.yaml)
    cat >> /etc/nginx/http.d/default.conf <<EOT
server {
  autoindex on;
  listen 80;
  listen [::]:80;
  server_name ${tor_address};
  root "/mnt/filebrowser/${directory}";
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
    if [[ $subdomain_type == "filebrowser" ]]; then
        directory="$(yq e ".subdomains.[] | select(.name == \"$subdomain\") | .settings | .directory" start9/config.yaml)"
        cat >> /etc/nginx/http.d/default.conf <<EOT
server {
  autoindex on;
  listen 80;
  listen [::]:80;
  server_name ${subdomain}.${tor_address};
  root "/mnt/filebrowser/${directory}";
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

exec tini -- nginx -g "daemon off;"
