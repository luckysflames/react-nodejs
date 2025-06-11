-- Таблица пользователей
CREATE TABLE users (
    "id" SERIAL PRIMARY KEY,
    "email" VARCHAR(255) UNIQUE NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "role" VARCHAR(50) DEFAULT 'USER',
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
-- Таблица брендов
CREATE TABLE brands (
    "id" SERIAL PRIMARY KEY,
    "name" VARCHAR(255) UNIQUE NOT NULL
);
-- Таблица типов
CREATE TABLE types (
    "id" SERIAL PRIMARY KEY,
    "name" VARCHAR(255) UNIQUE NOT NULL
);
-- Таблица устройств
CREATE TABLE devices (
    "id" SERIAL PRIMARY KEY,
    "name" VARCHAR(255) UNIQUE NOT NULL,
    "price" INTEGER NOT NULL CHECK ("price" >= 0),
    "rating" FLOAT DEFAULT 0,
    "img" VARCHAR(255) NOT NULL,
    "brandId" INTEGER REFERENCES brands("id") ON DELETE
    SET NULL,
        "typeId" INTEGER REFERENCES types("id") ON DELETE
    SET NULL,
        "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
-- Таблица характеристик устройств
CREATE TABLE device_info (
    "id" SERIAL PRIMARY KEY,
    "title" VARCHAR(255) NOT NULL,
    "description" VARCHAR(255) NOT NULL,
    "deviceId" INTEGER REFERENCES devices("id") ON DELETE CASCADE
);
-- Таблица рейтингов
CREATE TABLE ratings (
    "id" SERIAL PRIMARY KEY,
    "rate" FLOAT NOT NULL CHECK ("rate" >= 0),
    "userId" INTEGER REFERENCES users("id") ON DELETE CASCADE,
    "deviceId" INTEGER REFERENCES devices("id") ON DELETE CASCADE,
    CONSTRAINT unique_user_device_rating UNIQUE ("userId", "deviceId")
);
-- Таблица связи типов и брендов
CREATE TABLE type_brand (
    "id" SERIAL PRIMARY KEY,
    "typeId" INTEGER REFERENCES types("id") ON DELETE CASCADE,
    "brandId" INTEGER REFERENCES brands("id") ON DELETE CASCADE
);
-- Таблица корзин
CREATE TABLE baskets (
    "id" SERIAL PRIMARY KEY,
    "userId" INTEGER UNIQUE REFERENCES users("id") ON DELETE CASCADE,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
-- Таблица девайсов корзин
CREATE TABLE basket_devices (
    "id" SERIAL PRIMARY KEY,
    "basketId" INTEGER REFERENCES baskets("id") ON DELETE CASCADE,
    "deviceId" INTEGER REFERENCES devices("id") ON DELETE CASCADE,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
-- Таблица заказов
CREATE TABLE orders (
    "id" SERIAL PRIMARY KEY,
    "userId" INTEGER REFERENCES users("id") ON DELETE CASCADE,
    "deviceId" INTEGER REFERENCES devices("id") ON DELETE CASCADE,
    "amount" INTEGER NOT NULL CHECK ("amount" >= 0),
    "status" VARCHAR(50) NOT NULL DEFAULT 'PAID',
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
-- Индексы для оптимизации
CREATE INDEX idx_devices_brandId ON devices("brandId");
CREATE INDEX idx_devices_typeId ON devices("typeId");
CREATE INDEX idx_orders_userId ON orders("userId");
CREATE INDEX idx_orders_createdAt ON orders("createdAt");