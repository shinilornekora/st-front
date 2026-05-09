#!/bin/sh
set -e

# Подставляем переменные окружения в nginx конфиг
# BACKEND_HOST — имя сервиса бэкенда в Docker Compose (например: backend:3000)
: "${BACKEND_HOST:=backend:3000}"

envsubst '${BACKEND_HOST}' \
  < /etc/nginx/templates/app.conf.template \
  > /etc/nginx/conf.d/app.conf

echo "nginx proxy target: http://${BACKEND_HOST}"

exec nginx -g "daemon off;"
