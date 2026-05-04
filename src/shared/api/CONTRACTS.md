# API contracts

## [`POST /api/auth/login`](src/shared/api/auth.api.ts:39)
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

## [`POST /api/auth/register`](src/shared/api/auth.api.ts:78)
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

## [`POST /api/auth/logout`](src/shared/api/auth.api.ts:91)
**Что делает:** logout пользователя.

**Request**
```json
{}
```

**Response**
```json
{}
```

---

## [`POST /api/auth/refresh`](src/shared/api/client.ts:147)
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

## [`GET /api/auth/me`](src/shared/api/client.ts:269)
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

## [`GET /api/products`](src/shared/api/products.api.ts:33)
**Что делает:** получает список товаров.

**Request**
```json
{
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

## [`GET /api/products/{id}`](src/shared/api/products.api.ts:57)
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

## [`GET /api/products/{productId}/similar`](src/shared/api/products.api.ts:81)
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

## [`GET /api/admin/applications`](src/shared/api/applications.api.ts:66)
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

## [`PATCH /api/admin/applications/{id}/status`](src/shared/api/applications.api.ts:89)
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

## [`GET /api/admin/sellers/dashboard`](src/shared/api/sellers.api.ts:96)
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

## [`GET /api/b2b/analytics/dashboard`](src/shared/api/analytics.api.ts:147)
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

## [`GET /api/b2b/products`](src/shared/api/analytics.api.ts:178)
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