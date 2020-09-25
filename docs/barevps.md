## Bare VPS Production Setup

Before setting anything up, please check if the following requirements are met:
1. You have root-access to an ubuntu machine (tested with v18).
2. Port `80` (http) and `443` (https) are both open.
3. You have access to the dns-configuration of your domain.

In the following steps `beam.cafe` is used as domain, you'll have to change that correspondingly.

#### 1. Updating packages.
Before installing anything it's recommend to update the repository registry and packages on your system:

```sh
sudo apt update
sudo apt upgrade -y
```

#### 2. Installing nginx.
[beam.cafe](https://beam.cafe) is deployed using [nginx](https://nginx.org/), you can install it using the following commands:
```sh

# Adding the repository
echo "deb [arch=amd64] http://nginx.org/packages/mainline/ubuntu/ bionic nginx
deb-src http://nginx.org/packages/mainline/ubuntu/ bionic nginx
" | sudo tee /etc/apt/sources.list.d/nginx.list

# Adding nginx public key
wget https://nginx.org/keys/nginx_signing.key
sudo apt-key add nginx_signing.key
rm nginx_signing.key

# Installing nginx
sudo apt update
sudo apt install nginx
```

Setting up the nginx configuration:
```sh
echo "$(cat <<EOL
server {
	listen 443 ssl http2 default_server;
	listen [::]:443 ssl http2 default_server;
	server_name $DOMAIN;
	client_max_body_size 0;

	# Websocket endpoint
	location /ws {
		proxy_http_version 1.1;
		proxy_set_header Host \$host;
		proxy_set_header Upgrade \$http_upgrade;
		proxy_set_header Connection "upgrade";
		proxy_read_timeout 86400;
		proxy_set_header X-Forwarded-For $remote_addr;
		proxy_pass http://localhost:8080;
	}

	# Download-link and backend endpoint
	location ~ ^/(d|b) {
		proxy_buffering off;
		proxy_request_buffering off;
		proxy_set_header X-Forwarded-For $remote_addr;
		proxy_pass http://localhost:8080\$request_uri;
	}

	# Custom headers for webapp-related files
	location ~ (precache-manifest.*|service-worker|sw)\.js {
		add_header Cache-Control 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0';
		expires off;
		access_log off;
		root /home/ubuntu/beam.cafe.www;
	}

	# Static frontend
	location / {
		sendfile on;
		sendfile_max_chunk 1m;
		tcp_nopush on;
		autoindex off;
		index index.html;
		root /home/ubuntu/beam.cafe.www;
	}

	# Redirect on not-found / no-access
	location @400 {
		return 301 https://$host;
	}

	# Custom error pages
	error_page 404 403 = @400;

	# Restrict ssl protocols, ciphers
	ssl_protocols TLSv1 TLSv1.1 TLSv1.2;
	ssl_ecdh_curve secp521r1:secp384r1;
	ssl_ciphers EECDH+CHACHA20:EECDH+AES128:RSA+AES128:EECDH+AES256:RSA+AES256:EECDH+3DES:RSA+3DES:!MD5;
	ssl_session_cache shared:SSL:5m;
	ssl_session_timeout 1h;

	# Hide upstream proxy headers
	proxy_hide_header X-Powered-By;
	proxy_hide_header X-AspNetMvc-Version;
	proxy_hide_header X-AspNet-Version;
	proxy_hide_header X-Drupal-Cache;

	# Custom headers
	add_header Strict-Transport-Security "max-age=63072000; includeSubdomains" always;
	add_header Referrer-Policy "no-referrer";
	add_header Feature-Policy "geolocation none; midi none; notifications none; push none; sync-xhr none; microphone none; camera none; magnetometer none; gyroscope none; speaker none; vibrate none; fullscreen self; payment none; usb none;";
	add_header X-XSS-Protection "1; mode=block" always;
	add_header X-Content-Type-Options "nosniff" always;
	add_header X-Frame-Options "SAMEORIGIN" always;
	add_header Content-Security-Policy "default-src wss://beam.cafe 'self' data:; script-src 'self'; style-src 'self' fonts.googleapis.com; base-uri 'self'; font-src 'self' fonts.gstatic.com; form-action 'none'; object-src 'none'; upgrade-insecure-requests; block-all-mixed-content;" always;

	# Close slow connections (in case of a slow loris attack)
	client_body_timeout 10s;
	client_header_timeout 10s;
	keepalive_timeout 5s 5s;
	send_timeout 10s;

	# SSL
	ssl_certificate /etc/letsencrypt/live/$DOMAIN/fullchain.pem;
	ssl_certificate_key /etc/letsencrypt/live/$DOMAIN/privkey.pem;
	ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;

	# Gzip fallback
	gzip on;
	gzip_vary on;
	gzip_min_length 10240;
	gzip_proxied expired no-cache no-store private auth;
	gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml;
}

# HTTP Redirect
server {
	listen 80;
	server_name $DOMAIN;

	if (\$host = $DOMAIN) {
		return 301 https://\$host\$request_uri;
	}

	return 404;
}
EOL
)" | sudo tee /etc/nginx/conf.d/beam.cafe.conf
```

#### 3. Setting up certbot.
We're using [certbot](https://certbot.eff.org/) together with [letsencrypt](https://letsencrypt.org/) to get a free ssl certificate.

```sh
# Adding repositories
sudo apt install software-properties-common -y
sudo add-apt-repository universe
sudo add-apt-repository ppa:certbot/certbot
sudo apt update

# Installing and launching certbot
sudo apt install certbot python-certbot-nginx -y
sudo certbot certonly --nginx
```

#### 4. Starting nginx.
Nginx should be properly set up with your domain configuration, and a ssl certificate.
Now we have to enable and start the nginx server to serve our beam.cafe instance.

```sh
sudo systemctl enable nginx
sudo systemctl start nginx
```

#### 5. Setting up a firewall.
Both port `80` and `443` has to be open for beam.cafe to work properly.

```sh
sudo ufw allow ssh
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
echo 'y' | sudo ufw enable
```

#### 6. Installing nodejs and pm2.
[NodeJS](https://nodejs.org/en/) is used to build and deploy both the front- and backend of beam.cafe.

```sh
curl -sL https://deb.nodesource.com/setup_13.x | sudo bash
sudo apt install nodejs -y
```

[pm2](https://pm2.keymetrics.io/) will be used to manage the backend process:
```sh
npm install -g pm2
```

#### 7. Installing beam.cafe.
The last thing we need to do is installing both the front- and backend of beam.cafe:

> Make sure to update the domain used in the [webpack](https://github.com/dot-cafe/beam.cafe/blob/master/webpack.config.prod.js#L131) configuration.

```sh

# Download repos
git clone 'https://github.com/dot-cafe/beam.cafe.git' --depth 1
git clone 'https://github.com/dot-cafe/beam.cafe.backend.git' --depth 1

# Installing and building the frontend
cd beam.cafe
npm install
npm run build
mkdir ~/beam.cafe.www
mv dist/* ~/beam.cafe.www/

# Installing and building the backend
cd ../beam.cafe.backend
npm install
npm run build
pm2 start ~/beam.cafe.backend/dist/src/app.js --name beam.cafe.backend
```

### Additional Scripts

You can install all utility scripts with this command:
```sh
curl -sSL https://raw.githubusercontent.com/dot-cafe/beam.cafe.sh/master/utils/download.sh | bash
```

`update.frontend.sh` and `update.backend.sh` are used to pull and install both the latest front- and backend of beam.cafe.

### Further improvements

It's recommend to add the [brotli](https://docs.nginx.com/nginx/admin-guide/dynamic-modules/brotli/) nginx module, see [setup.brotli.sh](../scripts/setup.brotli.sh).
Brotli comes with a more dense compression compared to GZip.
