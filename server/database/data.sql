-- Очистка таблиц для предотвращения дублирования (можно закомментировать, если нужно добавить данные к существующим)
TRUNCATE TABLE basket_devices, baskets, brands, device_info, devices, orders, ratings, type_brand, types, users RESTART IDENTITY CASCADE;

-- Пользователи (users)
INSERT INTO users ("email", "password", "role", "createdAt", "updatedAt") VALUES
('admin@example.com', '$2b$10$dhdI02k/ycpSFwEPUHavGetPX66xUU9aYhGBaDAxe8ILYVQV98q5C', 'ADMIN', '2024-01-01 10:00:00', '2024-01-01 10:00:00'), -- Пароль: admin
('user1@example.com', '$2b$10$pU3VOTzFo/loylATFj6THuSWsFAgSFvbbazSRubGMP78bhmigeWMu', 'USER', '2024-01-05 12:00:00', '2024-01-05 12:00:00'), -- Пароль: user1
('user2@example.com', '$2b$10$qHTcfAyl/E58bvwJerIGnOSJz.DY7q/qHeGZcbh88znHJ7/VQ2Jiq', 'USER', '2024-02-10 14:00:00', '2024-02-10 14:00:00'); -- Пароль: user2

-- Бренды (brands)
INSERT INTO brands ("name") VALUES
('Apple'),
('Samsung'),
('Xiaomi'),
('Sony'),
('Huawei'),
('Asus'),
('Lenovo');

-- Типы (types)
INSERT INTO types ("name") VALUES
('Смартфоны'),
('Ноутбуки'),
('Планшеты'),
('Умные часы'),
('Наушники');

-- Связь типов и брендов (type_brand)
INSERT INTO type_brand ("typeId", "brandId") VALUES
(1, 1), (1, 2), (1, 3), (1, 4), (1, 5), -- Smartphone: Apple, Samsung, Xiaomi, Sony, Huawei
(2, 1), (2, 6), (2, 7), -- Laptop: Apple, Asus, Lenovo
(3, 1), (3, 2), (3, 3), -- Tablet: Apple, Samsung, Xiaomi
(4, 1), (4, 3), (4, 5), -- Smartwatch: Apple, Xiaomi, Huawei
(5, 4), (5, 5); -- Headphones: Sony, Huawei

-- Устройства (devices)
INSERT INTO devices ("name", "price", "rating", "img", "typeId", "brandId", "createdAt", "updatedAt") VALUES
('iPhone 14', 799.99, 4.5, 'iphone14.png', 1, 1, '2024-01-01 10:00:00', '2024-01-01 10:00:00'),
('Galaxy S23', 699.99, 4.3, 'galaxyS23.png', 1, 2, '2024-01-01 10:00:00', '2024-01-01 10:00:00'),
('Redmi Note 12', 299.99, 4.0, 'redmiNote12.png', 1, 3, '2024-01-01 10:00:00', '2024-01-01 10:00:00'),
('Xperia 5 IV', 599.99, 4.2, 'xperia5IV.png', 1, 4, '2024-01-01 10:00:00', '2024-01-01 10:00:00'),
('P50 Pro', 649.99, 4.4, 'p50Pro.png', 1, 5, '2024-01-01 10:00:00', '2024-01-01 10:00:00'),
('MacBook Air M2', 1199.99, 4.8, 'macBookAirM2.png', 2, 1, '2024-01-01 10:00:00', '2024-01-01 10:00:00'),
('ZenBook 14', 999.99, 4.6, 'zenBook14.png', 2, 6, '2024-01-01 10:00:00', '2024-01-01 10:00:00'),
('ThinkPad X1 Carbon', 1299.99, 4.7, 'thinkPadX1Carbon.png', 2, 7, '2024-01-01 10:00:00', '2024-01-01 10:00:00'),
('iPad Pro 12.9', 1099.99, 4.9, 'iPadPro129.png', 3, 1, '2024-01-01 10:00:00', '2024-01-01 10:00:00'),
('Galaxy Tab S8', 699.99, 4.5, 'galaxyTabS8.png', 3, 2, '2024-01-01 10:00:00', '2024-01-01 10:00:00'),
('Mi Pad 5', 399.99, 4.3, 'miPad5.png', 3, 3, '2024-01-01 10:00:00', '2024-01-01 10:00:00'),
('Apple Watch Series 8', 399.99, 4.6, 'appleWatchSeries8.png', 4, 1, '2024-01-01 10:00:00', '2024-01-01 10:00:00'),
('Mi Watch', 149.99, 4.0, 'miWatch.png', 4, 3, '2024-01-01 10:00:00', '2024-01-01 10:00:00'),
('Watch GT 3', 199.99, 4.2, 'watchGT3.png', 4, 5, '2024-01-01 10:00:00', '2024-01-01 10:00:00'),
('WH-1000XM5', 349.99, 4.8, 'wh1000XM5.png', 5, 4, '2024-01-01 10:00:00', '2024-01-01 10:00:00'),
('FreeBuds Pro 2', 199.99, 4.4, 'freeBudsPro2.png', 5, 5, '2024-01-01 10:00:00', '2024-01-01 10:00:00');

-- Характеристики устройств (device_info)
INSERT INTO device_info ("title", "description", "deviceId") VALUES
-- iPhone 14 (deviceId: 1)
('Display', '6.1\" Super Retina XDR OLED, 60 Hz', 1),
('Processor', 'Apple A15 Bionic, 5 nm', 1),
('Camera', 'Dual 12MP (wide, ultrawide), 4K video', 1),
-- Galaxy S23 (deviceId: 2)
('Display', '6.1\" Dynamic AMOLED 2X, 120 Hz', 2),
('Processor', 'Qualcomm Snapdragon 8 Gen 2, 4 nm', 2),
('Camera', 'Triple 50MP (wide) + 10MP (telephoto) + 12MP (ultrawide), 8K video', 2),
-- Redmi Note 12 (deviceId: 3)
('Display', '6.67\" AMOLED, 120 Hz', 3),
('Processor', 'Qualcomm Snapdragon 4 Gen 1, 6 nm', 3),
('Battery', '5000 mAh, 33W fast charging', 3),
-- Xperia 5 IV (deviceId: 4)
('Display', '6.1\" OLED, 120 Hz', 4),
('Processor', 'Qualcomm Snapdragon 8 Gen 1, 4 nm', 4),
('Camera', 'Triple 12MP (wide, ultrawide, telephoto), 4K HDR video', 4),
-- P50 Pro (deviceId: 5)
('Display', '6.6\" OLED, 120 Hz', 5),
('Processor', 'Qualcomm Snapdragon 888, 5 nm', 5),
('Camera', 'Quad 50MP (wide) + 64MP (periscope) + 13MP (ultrawide) + 40MP (mono), 4K video', 5),
-- MacBook Air M2 (deviceId: 6)
('Display', '13.6\" Liquid Retina, 2560x1664, 500 nits', 6),
('Processor', 'Apple M2, 8-core CPU, up to 10-core GPU', 6),
('Battery', 'Up to 18 hours, 52.6 Wh', 6),
-- ZenBook 14 (deviceId: 7)
('Display', '14\" OLED, 2880x1800, 120 Hz', 7),
('Processor', 'Intel Core Ultra 7 155H, 16 cores', 7),
('Memory', '16 GB LPDDR5X RAM', 7),
-- ThinkPad X1 Carbon (deviceId: 8)
('Display', '14\" WQUXGA, 3840x2400, 500 nits', 8),
('Processor', 'Intel Core i7-1365U, 10 cores', 8),
('Memory', '32 GB LPDDR5 RAM', 8),
-- iPad Pro 12.9 (deviceId: 9)
('Display', '12.9\" Liquid Retina XDR, 120 Hz, 1600 nits (HDR)', 9),
('Processor', 'Apple M2, 8-core CPU, 10-core GPU', 9),
('Camera', '12MP (wide) + 10MP (ultrawide), 4K video', 9),
-- Galaxy Tab S8 (deviceId: 10)
('Display', '11\" LTPS TFT, 120 Hz, 2560x1600', 10),
('Processor', 'Qualcomm Snapdragon 8 Gen 1, 4 nm', 10),
('Battery', '8000 mAh, 45W fast charging', 10),
-- Mi Pad 5 (deviceId: 11)
('Display', '11\" IPS LCD, 120 Hz, 2560x1600', 11),
('Processor', 'Qualcomm Snapdragon 860, 7 nm', 11),
('Camera', '13MP (rear), 4K video', 11),
-- Apple Watch Series 8 (deviceId: 12)
('Display', '1.9\" Retina LTPO OLED, 1000 nits', 12),
('Processor', 'Apple S8, dual-core', 12),
('Sensors', 'Blood oxygen, ECG, temperature sensing', 12),
-- Mi Watch (deviceId: 13)
('Display', '1.39\" AMOLED, 454x454', 13),
('Processor', 'Qualcomm Snapdragon Wear 4100', 13),
('Battery', '420 mAh, up to 16 days', 13),
-- Watch GT 3 (deviceId: 14)
('Display', '1.43\" AMOLED, 466x466', 14),
('Processor', 'ARM Cortex-M', 14),
('Battery', '455 mAh, up to 14 days', 14),
-- WH-1000XM5 (deviceId: 15)
('Driver', '30 mm dynamic driver', 15),
('Noise Cancellation', 'Active Noise Cancellation with 8 microphones', 15),
('Battery', 'Up to 30 hours with ANC, USB-C charging', 15),
-- FreeBuds Pro 2 (deviceId: 16)
('Driver', '11 mm dynamic + planar diaphragm', 16),
('Noise Cancellation', 'Active Noise Cancellation, up to 47 dB', 16),
('Battery', '6 hours (ANC off), 30 hours with case', 16);

-- Рейтинги (ratings)
INSERT INTO ratings ("rate", "userId", "deviceId") VALUES
(5.0, 2, 1),
(4.0, 3, 2),
(4.0, 2, 3),
(5.0, 2, 6),
(4.0, 3, 9),
(5.0, 3, 12);

-- Корзина для пользователя с id=1
INSERT INTO baskets ("userId") VALUES (1);

-- Товары в корзине
INSERT INTO basket_devices ("basketId", "deviceId", "quantity") VALUES
(1, 1, 2), -- iPhone 14, 2 штуки
(1, 2, 1); -- Samsung Galaxy S23, 1 штука

-- Заказы (orders) с неравномерным распределением
INSERT INTO orders ("userId", "deviceId", "amount", "status", "createdAt", "updatedAt") VALUES
-- Январь: 4 заказа
(2, 1, 799.99, 'PAID', '2024-01-05 12:00:00', '2024-01-05 12:00:00'),
(3, 2, 699.99, 'PAID', '2024-01-10 14:00:00', '2024-01-10 14:00:00'),
(2, 3, 299.99, 'PAID', '2024-01-15 16:00:00', '2024-01-15 16:00:00'),
(3, 4, 599.99, 'PAID', '2024-01-20 18:00:00', '2024-01-20 18:00:00'),
-- Февраль: 1 заказ
(2, 5, 649.99, 'PAID', '2024-02-10 20:00:00', '2024-02-10 20:00:00'),
-- Март: 3 заказа
(2, 6, 1199.99, 'PAID', '2024-03-05 22:00:00', '2024-03-05 22:00:00'),
(2, 7, 999.99, 'PAID', '2024-03-10 12:00:00', '2024-03-10 12:00:00'),
(3, 8, 1299.99, 'PAID', '2024-03-15 14:00:00', '2024-03-15 14:00:00'),
-- Апрель: 2 заказа
(3, 9, 1099.99, 'PAID', '2024-04-05 16:00:00', '2024-04-05 16:00:00'),
(3, 10, 699.99, 'PAID', '2024-04-10 18:00:00', '2024-04-10 18:00:00'),
-- Май: 4 заказа
(2, 11, 399.99, 'PAID', '2024-05-05 20:00:00', '2024-05-05 20:00:00'),
(2, 12, 399.99, 'PAID', '2024-05-10 22:00:00', '2024-05-10 22:00:00'),
(2, 13, 149.99, 'PAID', '2024-05-15 12:00:00', '2024-05-15 12:00:00'),
(3, 14, 199.99, 'PAID', '2024-05-20 14:00:00', '2024-05-20 14:00:00'),
-- Июнь: 1 заказ
-- 0 заказов
-- Июль: 3 заказа
(2, 16, 199.99, 'PAID', '2024-07-05 18:00:00', '2024-07-05 18:00:00'),
(2, 1, 799.99, 'PAID', '2024-07-10 20:00:00', '2024-07-10 20:00:00'),
(3, 2, 699.99, 'PAID', '2024-07-15 22:00:00', '2024-07-15 22:00:00'),
-- Август: 2 заказа
(2, 3, 299.99, 'PAID', '2024-08-05 12:00:00', '2024-08-05 12:00:00'),
(3, 4, 599.99, 'PAID', '2024-08-10 14:00:00', '2024-08-10 14:00:00'),
-- Сентябрь: 4 заказа
(3, 5, 649.99, 'PAID', '2024-09-05 16:00:00', '2024-09-05 16:00:00'),
(2, 6, 1199.99, 'PAID', '2024-09-10 18:00:00', '2024-09-10 18:00:00'),
(3, 7, 999.99, 'PAID', '2024-09-15 20:00:00', '2024-09-15 20:00:00'),
(2, 8, 1299.99, 'PAID', '2024-09-20 15:00:00', '2024-09-20 15:00:00'),
-- Октябрь: 1 заказ
(3, 9, 1099.99, 'PAID', '2024-10-05 12:00:00', '2024-10-05 12:00:00'),
-- Ноябрь: 7 заказов
(2, 10, 699.99, 'PAID', '2024-11-05 14:00:00', '2024-11-05 14:00:00'),
(3, 11, 399.99, 'PAID', '2024-11-07 16:00:00', '2024-11-07 16:00:00'),
(2, 12, 399.99, 'PAID', '2024-11-10 18:00:00', '2024-11-10 18:00:00'),
(2, 13, 149.99, 'PAID', '2024-11-12 20:00:00', '2024-11-12 20:00:00'),
(3, 14, 199.99, 'PAID', '2024-11-15 22:00:00', '2024-11-15 22:00:00'),
(2, 15, 349.99, 'PAID', '2024-11-20 12:00:00', '2024-11-20 12:00:00'),
(3, 16, 199.99, 'PAID', '2024-11-25 14:00:00', '2024-11-25 14:00:00'),
-- Декабрь: 8 заказов
(2, 1, 799.99, 'PAID', '2024-12-05 16:00:00', '2024-12-05 16:00:00'),
(3, 2, 699.99, 'PAID', '2024-12-07 18:00:00', '2024-12-07 18:00:00'),
(2, 3, 299.99, 'PAID', '2024-12-10 20:00:00', '2024-12-10 20:00:00'),
(3, 4, 599.99, 'PAID', '2024-12-12 22:00:00', '2024-12-12 22:00:00'),
(2, 5, 649.99, 'PAID', '2024-12-15 12:00:00', '2024-12-15 12:00:00'),
(3, 6, 1199.99, 'PAID', '2024-12-17 14:00:00', '2024-12-17 14:00:00'),
(2, 7, 999.99, 'PAID', '2024-12-20 16:00:00', '2024-12-20 16:00:00'),
(3, 8, 1299.99, 'PAID', '2024-12-25 18:00:00', '2024-12-25 18:00:00');
