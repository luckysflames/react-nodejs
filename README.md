# Lucky Store - Интернет-магазин электроники

## Описание проекта

Lucky Store - это полнофункциональный интернет-магазин электроники с административной панелью, системой аутентификации, корзиной покупок и аналитикой продаж. Проект состоит из клиентской части (React) и серверной части (Node.js + Express + Sequelize).

## Основные возможности

- Просмотр каталога устройств с фильтрацией по типам и брендам
- Система аутентификации и регистрации пользователей
- Корзина покупок с возможностью изменения количества товаров
- Административная панель для управления товарами, типами и брендами
- Аналитика продаж с графиками и экспортом данных
- Система рейтингов для товаров

## Технологии

### Клиентская часть (Frontend)
- React 19
- React Router
- MobX для управления состоянием
- React Bootstrap для UI компонентов
- Axios для HTTP запросов
- Chart.js для визуализации аналитики

### Серверная часть (Backend)
- Node.js + Express
- Sequelize (ORM для PostgreSQL)
- JWT аутентификация
- File upload для загрузки изображений
- CSV экспорт данных

### База данных
- PostgreSQL

## Установка и запуск

### Требования
- Node.js (версия 18+)
- PostgreSQL
- npm или yarn

### Настройка серверной части

1. Перейдите в директорию сервера:
```bash
cd server
```

2. Установите зависимости:
```bash
npm install
```

3. Создайте файл `.env` в корне серверной части на основе `.env.example`:
```env
PORT=5001
DB_NAME=online_store
DB_USER=postgres
DB_PASSWORD=your_password
DB_HOST=localhost
DB_PORT=5432
SECRET_KEY=random_secret_key123
```

4. Запустите сервер:
```bash
npm run dev
```

### Настройка клиентской части

1. Перейдите в директорию клиента:
```bash
cd client
```

2. Установите зависимости:
```bash
npm install
```

3. Создайте файл `.env` в корне клиентской части:
```env
REACT_APP_API_URL="http://localhost:5001/"
```

4. Запустите клиентское приложение:
```bash
npm start
```
## Создание базы данных

Для создания базы данных выполните SQL-скрипты из файла `schema.sql` в вашей PostgreSQL.

## Наполнение базы данных

Для первоначального наполнения базы данных выполните SQL-скрипты из файла `data.sql` в вашей PostgreSQL.

## Доступные учетные записи

- Администратор:
  - Email: admin@example.com
  - Пароль: admin

- Пользователи:
  - Email: user1@example.com
  - Пароль: user1
  - Email: user2@example.com
  - Пароль: user2

## Структура проекта

### Клиентская часть
- `src/components` - React компоненты
- `src/http` - API клиент
- `src/pages` - Страницы приложения
- `src/store` - MobX хранилища
- `src/utils` - Вспомогательные утилиты и константы

### Серверная часть
- `controllers` - Контроллеры для обработки запросов
- `database` - Настройки базы данных
- `middleware` - Промежуточное ПО
- `models` - Модели Sequelize
- `routes` - Маршруты API
- `static` - Статические файлы (изображения)

## API Endpoints

- `POST /api/user/registration` - Регистрация пользователя
- `POST /api/user/login` - Вход пользователя
- `GET /api/user/auth` - Проверка аутентификации
- `POST /api/type` - Создание типа (ADMIN)
- `GET /api/type` - Получение списка типов
- `POST /api/brand` - Создание бренда (ADMIN)
- `GET /api/brand` - Получение списка брендов
- `POST /api/device` - Создание устройства (ADMIN)
- `GET /api/device` - Получение списка устройств
- `GET /api/device/:id` - Получение устройства по ID
- `POST /api/basket/add` - Добавление в корзину
- `GET /api/basket` - Получение корзины
- `PUT /api/basket/quantity` - Изменение количества товара
- `DELETE /api/basket/remove` - Удаление из корзины
- `POST /api/basket/checkout` - Оформление заказа
- `GET /api/order/analytics` - Аналитика заказов
- `GET /api/order/export` - Экспорт заказов в CSV
- `GET /api/order/no-orders` - Периоды без заказов
- `GET /api/order/peak-period` - Пиковые периоды заказов

## Лицензия

Этот проект распространяется под лицензией MIT.