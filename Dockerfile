FROM caddy

# Copy caddy configuration
COPY Caddyfile /etc/caddy/Caddyfile

# Copy static website content to caddy's www directory
COPY site /usr/share/caddy
