# st-front

## Mock API server

Для запуска фронта без реального backend добавлен mock server, который покрывает все контракты из `src/shared/api/*.api.ts`.

### Запуск

1. В одном терминале запустить mock API:
   - `npm run mock:server`
2. Во втором терминале запустить фронт с proxy на mock:
   - `npm run dev:mock`

По умолчанию mock server слушает `http://localhost:3100`, а `dev:mock` проксирует `/api/*` на этот адрес.

### Конфигурация base URL

- В клиенте API используется `VITE_API_BASE_URL` (если не задана, используется `/api`).
- Это позволяет в сборке направить запросы на любой адрес backend/mock backend, например:
  - `VITE_API_BASE_URL=http://localhost:3100/api npm run build`

### Что реализовано

Mock server реализует группы контрактов:

- auth (`/auth/login`, `/auth/register`, `/auth/refresh`, `/auth/me`, `/auth/logout`, `/auth/forgot-password`)
- products (`/products`, `/products/:id`, `/products/:id/similar`)
- favorites (`/favorites`, `/favorites/products`, `/favorites/:productId`)
- cart (`/cart`, `/cart/items`, `/cart/items/:itemId`)
- orders (`/orders`)
- seller applications (`/seller-applications`)
- discount requests (`/discount-requests`)
- user profile/settings (`/users/me`, `/users/me/requisites`, `/users/me/settings`)
- admin dashboards/applications (`/admin/applications`, `/admin/applications/:id/status`, `/admin/sellers/dashboard`)
- b2b analytics/products (`/b2b/analytics/dashboard`, `/b2b/products`, `/b2b/products/:id`)
