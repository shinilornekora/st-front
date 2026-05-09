# API contracts

## Runtime base URL

- Все пути ниже указаны как внешние эндпоинты вида `/api/...`.
- Реальный базовый URL задается через `VITE_API_BASE_URL` в `src/shared/api/client.ts`.
- По умолчанию используется `'/api'`, поэтому фронт дергает эндпоинты в формате `/api/...`.
- В api-модулях используются относительные пути без двойного префикса (например `'/orders'`, `'/users/me'`, `'/seller-applications'`, `'/discount-requests'`).

## [`POST /api/auth/login`](src/shared/api/auth.api.ts)
**Что делает:** логин пользователя.

**Request**
```json
{
  "body": {
    "login": "string",
    "password": "string"
  }
}
```

**Response**
```json
{
  "user": {
    "id": 1,
    "role": "CUSTOMER | SELLER | ADMIN",
    "email": "user@example.com",
    "fullName": "Иван Иванов",
    "phone": "+79999999999",
    "specificFields": {}
  },
  "accessToken": "string",
  "message": "string"
}
```

---

## [`POST /api/auth/register`](src/shared/api/auth.api.ts)
**Что делает:** регистрация пользователя.

**Request**
```json
{
  "body": {
    "name": "string",
    "phone": "string",
    "email": "string",
    "password": "string",
    "role": "CUSTOMER | SELLER"
  }
}
```

**Response**
```json
{
  "message": "string"
}
```

---

## [`POST /api/auth/logout`](src/shared/api/auth.api.ts)
**Что делает:** logout пользователя.

**Request**
```json
{}
```

**Response**
```json
null
```
`HTTP 204 No Content` (тело ответа отсутствует).

---

## [`POST /api/auth/refresh`](src/shared/api/client.ts)
**Что делает:** обновляет access token по refresh-cookie.

**Request**
```json
{}
```

**Response**
```json
{
  "accessToken": "string"
}
```

---

## [`GET /api/auth/me`](src/shared/api/client.ts)
**Что делает:** возвращает текущего авторизованного пользователя.

**Request**
```json
{}
```

**Response**
```json
{
  "user": {
    "id": 1,
    "role": "CUSTOMER | SELLER | ADMIN",
    "email": "user@example.com",
    "fullName": "Иван Иванов",
    "phone": "+79999999999",
    "specificFields": {}
  }
}
```

---

## [`POST /api/auth/forgot-password`](src/shared/api/auth.api.ts)
**Что делает:** отправляет запрос на восстановление пароля.

**Request**
```json
{
  "body": {
    "email": "string"
  }
}
```

**Response**
```json
{
  "message": "string"
}
```

---

## [`GET /api/products`](src/shared/api/products.api.ts)
**Что делает:** получает список товаров.

**Request**
```json
{
  "query": {
    "count": "number",
    "search": "string (optional)"
  }
}
```
`search` — строка поиска по товарам, передается как URL-encoded query параметр.

**Response**
```json
{
  "products": [
    {
      "id": 1,
      "name": "string",
      "slug": "string",
      "description": "string",
      "price": 10000,
      "discount": 10,
      "currency": "string",
      "inStock": true,
      "article": "string",
      "category": [
        {
          "id": "string",
          "name": "string",
          "parentId": "string"
        }
      ],
      "tags": [
        {
          "id": "string",
          "name": "string",
          "color": "string"
        }
      ],
      "images": ["string"],
      "sizes": ["string"],
      "stockStatus": "in_stock | pre_order",
      "gender": "male | female | unisex",
      "seller": {
        "id": 1,
        "name": "string",
        "logo": "string",
        "rating": 4.5
      },
      "isFavorite": true
    }
  ]
}
```

---

## [`GET /api/products/{id}`](src/shared/api/products.api.ts)
**Что делает:** получает товар по id.

**Request**
```json
{
  "path": {
    "id": "number"
  }
}
```

**Response**
```json
{
  "product": {
    "id": 1,
    "name": "string",
    "slug": "string",
    "description": "string",
    "price": 10000,
    "discount": 10,
    "currency": "string",
    "inStock": true,
    "article": "string",
    "category": [
      {
        "id": "string",
        "name": "string",
        "parentId": "string"
      }
    ],
    "tags": [
      {
        "id": "string",
        "name": "string",
        "color": "string"
      }
    ],
    "images": ["string"],
    "sizes": ["string"],
    "stockStatus": "in_stock | pre_order",
    "gender": "male | female | unisex",
    "seller": {
      "id": 1,
      "name": "string",
      "logo": "string",
      "rating": 4.5
    },
    "isFavorite": true
  }
}
```

---

## [`GET /api/products/{productId}/similar`](src/shared/api/products.api.ts)
**Что делает:** получает похожие товары.

**Request**
```json
{
  "path": {
    "productId": "number"
  },
  "query": {
    "count": "number"
  }
}
```

**Response**
```json
{
  "products": [
    {
      "id": 1,
      "name": "string",
      "slug": "string",
      "description": "string",
      "price": 10000,
      "discount": 10,
      "currency": "string",
      "inStock": true,
      "article": "string",
      "category": [
        {
          "id": "string",
          "name": "string",
          "parentId": "string"
        }
      ],
      "tags": [
        {
          "id": "string",
          "name": "string",
          "color": "string"
        }
      ],
      "images": ["string"],
      "sizes": ["string"],
      "stockStatus": "in_stock | pre_order",
      "gender": "male | female | unisex",
      "seller": {
        "id": 1,
        "name": "string",
        "logo": "string",
        "rating": 4.5
      },
      "isFavorite": true
    }
  ]
}
```

---

## [`GET /api/admin/applications`](src/shared/api/applications.api.ts)
**Что делает:** получает список заявок продавцов.

**Request**
```json
{}
```

**Response**
```json
[
  {
    "id": 1,
    "name": "string",
    "phone": "string",
    "email": "string",
    "status": "pending | approved | rejected"
  }
]
```

---

## [`PATCH /api/admin/applications/{id}/status`](src/shared/api/applications.api.ts)
**Что делает:** обновляет статус заявки продавца.

**Request**
```json
{
  "path": {
    "id": "number"
  },
  "body": {
    "status": "approved | rejected"
  }
}
```

**Response**
```json
{
  "message": "string"
}
```

---

## [`GET /api/admin/sellers/dashboard`](src/shared/api/sellers.api.ts)
**Что делает:** получает дашборд продавцов.

**Request**
```json
{
  "query": {
    "period": "month | quarter | year"
  }
}
```

**Response**
```json
{
  "revenue": {
    "total": "string",
    "itemsCount": 0,
    "chartData": {
      "labels": ["string"],
      "data": [0]
    }
  },
  "growth": {
    "percentage": "string",
    "itemsCount": 0,
    "chartData": {
      "labels": ["string"],
      "data": [0]
    }
  },
  "sellers": [
    {
      "id": 1,
      "name": "string",
      "revenue": "string",
      "growth": "string"
    }
  ]
}
```

---

## [`GET /api/b2b/analytics/dashboard`](src/shared/api/analytics.api.ts)
**Что делает:** получает B2B аналитику.

**Request**
```json
{
  "query": {
    "period": "month | quarter | year"
  }
}
```

**Response**
```json
{
  "revenue": {
    "total": "string",
    "change": "string",
    "chartData": {
      "labels": ["string"],
      "data": [0]
    }
  },
  "productsSold": {
    "total": 0,
    "change": "string",
    "chartData": {
      "labels": ["string"],
      "data": [0]
    }
  },
  "products": [
    {
      "id": 1,
      "name": "string",
      "article": "string",
      "price": 0,
      "sold": 0,
      "revenue": 0,
      "dynamics": "string",
      "stock": 0,
      "imageUrl": "string"
    }
  ]
}
```

---

## [`GET /api/b2b/products`](src/shared/api/analytics.api.ts)
**Что делает:** получает список товаров продавца.

**Request**
```json
{}
```

**Response**
```json
[
  {
    "id": 1,
    "article": "string",
    "name": "string",
    "price": 0
  }
]
```

---

## [`POST /api/b2b/products`](src/shared/api/analytics.api.ts)
**Что делает:** создаёт новый товар продавца.

**Request**
```json
{
  "body": {
    "name": "string",
    "article": "string",
    "price": 0,
    "discountPrice": 0,
    "sizes": ["small", "medium", "large"],
    "colors": ["white", "black", "red"],
    "composition": "string",
    "gender": "male | female | unisex",
    "images": ["string"]
  }
}
```

**Response**
```json
{
  "id": 1,
  "article": "string",
  "name": "string",
  "price": 0
}
```

---

## [`PUT /api/b2b/products/{id}`](src/shared/api/analytics.api.ts)
**Что делает:** обновляет товар продавца по id.

**Request**
```json
{
  "path": {
    "id": "number"
  },
  "body": {
    "name": "string",
    "article": "string",
    "price": 0,
    "discountPrice": 0,
    "sizes": ["small", "medium", "large"],
    "colors": ["white", "black", "red"],
    "composition": "string",
    "gender": "male | female | unisex",
    "images": ["string"]
  }
}
```

**Response**
```json
{
  "id": 1,
  "article": "string",
  "name": "string",
  "price": 0
}
```

---

## [`DELETE /api/b2b/products/{id}`](src/shared/api/analytics.api.ts)
**Что делает:** удаляет товар продавца по id.

**Request**
```json
{
  "path": {
    "id": "number"
  }
}
```

**Response**
```json
{
  "message": "string"
}
```

---

## [`GET /api/favorites`](src/shared/api/favorites.api.ts)
**Что делает:** возвращает id избранных товаров текущего пользователя.

**Request**
```json
{}
```

**Response**
```json
{
  "favorites": [1, 5, 10]
}
```

---

## [`GET /api/favorites/products`](src/shared/api/favorites.api.ts)
**Что делает:** возвращает полные карточки избранных товаров текущего пользователя.

**Request**
```json
{}
```

**Response**
```json
{
  "products": [
    {
      "id": 1,
      "name": "string",
      "slug": "string",
      "description": "string",
      "price": 10000,
      "discount": 10,
      "currency": "string",
      "inStock": true,
      "article": "string",
      "category": [{ "id": "string", "name": "string" }],
      "tags": [{ "id": "string", "name": "string" }],
      "images": ["string"],
      "sizes": ["string"],
      "stockStatus": "in_stock | pre_order",
      "gender": "male | female | unisex",
      "seller": { "id": 1, "name": "string" },
      "isFavorite": true
    }
  ]
}
```

---

## [`POST /api/favorites/{productId}`](src/shared/api/favorites.api.ts)
**Что делает:** добавляет товар в избранное.

**Request**
```json
{
  "path": {
    "productId": "number"
  }
}
```

**Response**
```json
null
```
`HTTP 204 No Content` (тело ответа отсутствует).

---

## [`DELETE /api/favorites/{productId}`](src/shared/api/favorites.api.ts)
**Что делает:** удаляет товар из избранного.

**Request**
```json
{
  "path": {
    "productId": "number"
  }
}
```

**Response**
```json
null
```
`HTTP 204 No Content` (тело ответа отсутствует).

---

## [`GET /api/cart`](src/shared/api/cart.api.ts)
**Что делает:** возвращает корзину текущего авторизованного пользователя.

**Request**
```json
{}
```

**Response**
```json
{
  "items": [
    {
      "id": 1,
      "product": {},
      "quantity": 1,
      "price": 10000,
      "discount": 10,
      "currency": "RUB",
      "selectedColor": "string"
    }
  ],
  "total": 10000,
  "currency": "RUB"
}
```

---

## [`POST /api/cart/items`](src/shared/api/cart.api.ts)
**Что делает:** добавляет товар в корзину.

**Request**
```json
{
  "body": {
    "productId": 1,
    "quantity": 1,
    "selectedColor": "string"
  }
}
```

**Response**
```json
{
  "items": [],
  "total": 0,
  "currency": "RUB"
}
```

---

## [`PATCH /api/cart/items/{itemId}`](src/shared/api/cart.api.ts)
**Что делает:** обновляет количество товара в корзине.

**Request**
```json
{
  "path": {
    "itemId": 1
  },
  "body": {
    "quantity": 2
  }
}
```

**Response**
```json
{
  "items": [],
  "total": 0,
  "currency": "RUB"
}
```

---

## [`DELETE /api/cart/items/{itemId}`](src/shared/api/cart.api.ts)
**Что делает:** удаляет товар из корзины.

**Request**
```json
{
  "path": {
    "itemId": 1
  }
}
```

**Response**
```json
{
  "items": [],
  "total": 0,
  "currency": "RUB"
}
```

---

## [`DELETE /api/cart`](src/shared/api/cart.api.ts)
**Что делает:** полностью очищает корзину.

**Request**
```json
{}
```

**Response**
```json
{
  "message": "string"
}
```

---

## [`GET /api/orders`](src/shared/api/orders.api.ts)
**Что делает:** возвращает список заказов текущего авторизованного пользователя.

**Auth:** Bearer token required

**Request**
```json
{}
```

**Response**
```json
[
  {
    "id": "number",
    "createdAt": "string (ISO 8601)",
    "items": [
      {
        "id": "number",
        "product": { "id": "number", "name": "string", "price": "number" },
        "quantity": "number",
        "price": "number",
        "currency": "string"
      }
    ],
    "total": "number",
    "currency": "string",
    "status": "PAID | PENDING | CANCELLED | REFUNDED",
    "customer": { "id": "number", "fullName": "string", "email": "string", "phone": "string" },
    "seller": { "id": "number", "name": "string" }
  }
]
```

---

## [`POST /api/orders`](src/shared/api/orders.api.ts)
**Что делает:** создаёт новый заказ из текущей корзины.

**Auth:** Bearer token required

**Request**
```json
{
  "items": [
    {
      "productId": "number",
      "quantity": "number",
      "price": "number"
    }
  ],
  "currency": "string"
}
```

**Response**
```json
{
  "id": "number",
  "createdAt": "string (ISO 8601)",
  "items": [...],
  "total": "number",
  "currency": "string",
  "status": "PAID | PENDING | CANCELLED | REFUNDED",
  "customer": { "id": "number", "fullName": "string", "email": "string", "phone": "string" },
  "seller": { "id": "number", "name": "string" },
  "paymentInfo": {}
}
```

---

## [`POST /api/seller-applications`](src/shared/api/sellerApplication.api.ts)
**Что делает:** подаёт заявку на регистрацию продавца.

**Auth:** Bearer token required

**Request**
```json
{
  "name": "string",
  "phone": "string",
  "email": "string",
  "inn": "string (optional)",
  "billingAccount": "string (optional)"
}
```

**Response**
```json
{
  "id": "number",
  "userId": "number",
  "status": "NEW | PENDING | APPROVED | REJECTED",
  "createdAt": "string (ISO 8601)",
  "message": "string (optional)"
}
```

---

## [`PATCH /api/auth/me`](src/shared/api/auth.api.ts)
**Что делает:** обновляет профиль текущего авторизованного пользователя.

**Auth:** Bearer token required

**Request**
```json
{
  "fullName": "string (optional)",
  "phone": "string (optional)",
  "email": "string (optional)"
}
```

**Response**
```json
{
  "id": "number",
  "role": "CUSTOMER | SELLER | ADMIN",
  "email": "string",
  "fullName": "string",
  "phone": "string",
  "specificFields": {}
}
```

---

## [`DELETE /api/users/me`](src/shared/api/user.api.ts)
**Что делает:** удаляет аккаунт текущего авторизованного пользователя. Необратимое действие.

**Auth:** Bearer token required

**Request**
```json
{}
```

**Response**
```json
null
```
`HTTP 204 No Content` (тело ответа отсутствует).

---

## [`POST /api/users/me/requisites`](src/shared/api/user.api.ts)
**Что делает:** сохраняет банковские реквизиты пользователя.

**Auth:** Bearer token required

**Request**
```json
{
  "country": "string",
  "name": "string",
  "bik": "string",
  "account": "string",
  "fullName": "string"
}
```

**Response**
```json
{
  "country": "string",
  "name": "string",
  "bik": "string",
  "account": "string",
  "fullName": "string"
}
```

---

## [`PATCH /api/users/me/settings`](src/shared/api/user.api.ts)
**Что делает:** сохраняет пользовательские настройки (уведомления, email-рассылки и т.д.).

**Auth:** Bearer token required

**Request**
```json
{
  "notifications": "boolean",
  "email": "boolean",
  "marketing": "boolean",
  "analytics": "boolean"
}
```

**Response**
```json
{
  "notifications": "boolean",
  "email": "boolean",
  "marketing": "boolean",
  "analytics": "boolean"
}
```

---

## [`POST /api/discount-requests`](src/shared/api/discountRequest.api.ts)
**Что делает:** отправляет запрос на скидку продавцу от покупателя.

**Auth:** Bearer token required

**Request**
```json
{
  "productId": "number",
  "discountAmount": "number"
}
```

**Response**
```json
{
  "id": "number",
  "productId": "number",
  "discountAmount": "number",
  "status": "PENDING | APPROVED | REJECTED",
  "createdAt": "string (ISO 8601)"
}
```