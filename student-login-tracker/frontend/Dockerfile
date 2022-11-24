# Dockerfile for frontend based on httpd (Apache)
FROM httpd
# Update packages and install curl
RUN apt update -y; apt upgrade -y; apt install -y curl
# Install nodejs
RUN curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
RUN apt install -y nodejs
# Install tailwindcss
RUN npm install -g tailwindcss
# Set working directory to apache folder
WORKDIR /usr/local/apache2
# Copy tailwind config, httpd config, and web contents
COPY ./tailwind.config.js ./
COPY ./httpd.conf ./conf/httpd.conf
COPY ./src/ ./htdocs/
# Set web hosting to 777 to build tailwind
RUN chmod -R 777 ./htdocs
RUN npx tailwindcss -i ./htdocs/assets/css/tailwindIn.css -o ./htdocs/assets/css/tailwind.css
# Set default web server permissions
RUN find ./htdocs -type d -print0 | xargs -0 chmod 0755; find ./htdocs -type f -print0 | xargs -0 chmod 0644

# Really dumb solution to using the appropriate hostnames via environment variables on frontend
# Solution found at https://stackoverflow.com/questions/1583219/how-can-i-do-a-recursive-find-replace-of-a-string-with-awk-or-sed
CMD grep -rl FRONTEND_HOST /usr/local/apache2/htdocs | xargs sed -i "s/FRONTEND_HOST/$FRONTEND_HOST/g" \
    && grep -rl BACKEND_HOST /usr/local/apache2/htdocs | xargs sed -i "s/BACKEND_HOST/$BACKEND_HOST/g" \
    && /usr/local/bin/httpd-foreground
