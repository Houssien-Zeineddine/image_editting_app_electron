FROM bitnami/laravel

WORKDIR /app

COPY ./backend /app/

COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

RUN composer install --no-dev --optimize-autoloader