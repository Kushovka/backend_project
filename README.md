# NestJS Test Backend Project

Проект на **NestJS + Sequelize + PostgreSQL** для управления пользователями, товарами и заказами.  
Реализованы: транзакции, валидация, хеширование паролей, Swagger документация и тесты.

---

## 🚀 Стек
- **Node.js 18+**, **NestJS**, **TypeScript**
- **Sequelize**, **PostgreSQL**
- **Jest** (unit + integration тесты)
- **Swagger** (`@nestjs/swagger`)

  ---

  ## 📦 API Endpoints

### Users
- `POST /users` – создать пользователя  
- `GET /users` – список пользователей  
- `GET /users/:id` – пользователь по ID  
- `PATCH /users/:id` – обновить пользователя  
- `DELETE /users/:id` – удалить пользователя  

### Products
- `POST /products` – создать товар  
- `GET /products` – список с поиском (`?search=`)  
- `GET /products/:id` – товар по ID  
- `PATCH /products/:id` – обновить товар  
- `DELETE /products/:id` – удалить товар  

### Orders
- `POST /orders` – создать заказ  
- `GET /orders` – список заказов  
- `GET /orders/:id` – заказ по ID  
- `PATCH /orders/:id` – обновить статус  
- `DELETE /orders/:id` – удалить заказ  
- `POST /orders/:id/cancel` – отменить заказ

  ---

## 🔒 Особенности
- Хеширование паролей (bcrypt)  
- Транзакции и защита от race conditions  
- Валидация DTO  
- Глобальный фильтр ошибок  
- Логирование действий и ошибок  
- Swagger документация для всех endpoints  
- Unit и integration тесты (`npm run test`)  

---

## ⚡ Установка и запуск
```bash
git clone https://github.com/Kushovka/backend_project.git
cd MG
npm install

.env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_NAME=test_db
PORT=3000

npm run migrate

npm run start:dev

