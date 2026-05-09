# ─── Stage 1: build ───────────────────────────────────────────────────────────
FROM node:22-alpine AS builder

WORKDIR /app

# Копируем манифесты отдельно для кэширования слоя зависимостей
COPY package.json package-lock.json ./

RUN npm ci --ignore-scripts

# Копируем исходники
COPY . .

# Собираем продакшн-бандл
# VITE_API_TARGET не нужен на этапе сборки — proxy работает только в dev.
# В продакшне nginx сам проксирует /api на бэкенд.
RUN npm run build

# ─── Stage 2: serve ───────────────────────────────────────────────────────────
FROM nginx:1.27-alpine AS runner

# Устанавливаем gettext для envsubst
RUN apk add --no-cache gettext

# Удаляем дефолтный конфиг nginx
RUN rm /etc/nginx/conf.d/default.conf

# Копируем шаблон конфига (с ${BACKEND_HOST})
COPY nginx.conf /etc/nginx/templates/app.conf.template

# Копируем собранную статику из builder
COPY --from=builder /app/dist /usr/share/nginx/html

# Скрипт запуска: подставляет переменные окружения в nginx.conf и стартует nginx
COPY docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

EXPOSE 80

CMD ["/docker-entrypoint.sh"]
