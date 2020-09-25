## [Nginx](https://www.nginx.com/) configuration for beam.cafe

#### 1. Installing nginx.
You can install nginx it using the following commands:
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

#### 2. Setting up the server block
Add this to your `mydomain.conf` file, make sure to replace beam.cafe with your domain.

We assume `/home/ubuntu/beam.cafe` is the location where `frontend` and `docker-compose.yml` lives and `8080` is used
as your backend port. If not update these values accordingly.

```
server {
	listen 443 ssl http2 default_server;
	listen [::]:443 ssl http2 default_server;
	server_name beam.cafe;
	client_max_body_size 0;

	# Websocket endpoint
	location /ws {
		proxy_http_version 1.1;
		proxy_set_header Host $host;
		proxy_set_header Upgrade $http_upgrade;
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
		proxy_pass http://localhost:8080$request_uri;
	}

	# Custom headers for webapp-related files
	location ~ (precache-manifest.*|service-worker|sw)\.js {
		add_header Cache-Control 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0';
		expires off;
		access_log off;
		root /home/ubuntu/beam.cafe/frontend;
	}

	# Static frontend
	location / {
		sendfile on;
		sendfile_max_chunk 1m;
		tcp_nopush on;
		autoindex off;
		index index.html;
		root /home/ubuntu/beam.cafe/frontend;
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
	ssl_certificate /etc/letsencrypt/live/beam.cafe/fullchain.pem;
	ssl_certificate_key /etc/letsencrypt/live/beam.cafe/privkey.pem;
	ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;

	# Gzip
	gzip on;
	gzip_vary on;
	gzip_min_length 10240;
	gzip_proxied expired no-cache no-store private auth;
	gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml;
}

# HTTP Redirect
server {
	listen 80;
	server_name beam.cafe;

	if ($host = beam.cafe) {
		return 301 https://$host$request_uri;
	}

	return 404;
}
```
