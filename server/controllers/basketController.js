const { Basket, BasketDevice, Device, Order } = require("../models/models");
const ApiError = require("../error/apiError");

class BasketController {
    async addToBasket(req, res, next) {
        try {
            const { userId, deviceId, quantity = 1 } = req.body;
            console.log("Add to basket request:", { userId, deviceId, quantity });

            const userExists = await Basket.findOne({ where: { userId } });
            if (!userExists) {
                console.log(`Creating new basket for userId: ${userId}`);
                await Basket.create({ userId });
            }

            let basket = await Basket.findOne({ where: { userId } });
            if (!basket) {
                return next(ApiError.badRequest("Не удалось создать корзину"));
            }

            const deviceExists = await Device.findOne({ where: { id: deviceId } });
            if (!deviceExists) {
                return next(ApiError.badRequest("Устройство не найдено"));
            }

            const basketDevice = await BasketDevice.findOne({
                where: { basketId: basket.id, deviceId },
            });
            if (basketDevice) {
                basketDevice.quantity += parseInt(quantity);
                await basketDevice.save();
                console.log(`Updated quantity for deviceId: ${deviceId}`);
            } else {
                await BasketDevice.create({
                    basketId: basket.id,
                    deviceId,
                    quantity: parseInt(quantity),
                });
                console.log(`Added new deviceId: ${deviceId} to basket`);
            }
            return res.json({ message: "Товар добавлен в корзину" });
        } catch (e) {
            console.error("Add to basket error:", e);
            next(ApiError.badRequest(e.message || "Ошибка при добавлении в корзину"));
        }
    }

    async getBasket(req, res, next) {
        try {
            const { userId } = req.query;
            const basket = await Basket.findOne({
                where: { userId },
                include: [
                    {
                        model: BasketDevice,
                        include: [{ model: Device }],
                    },
                ],
            });
            return res.json(basket || { id: null, basket_devices: [] });
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }

    async updateQuantity(req, res, next) {
        try {
            const { basketDeviceId, quantity } = req.body;
            const basketDevice = await BasketDevice.findOne({ where: { id: basketDeviceId } });
            if (!basketDevice) {
                return next(ApiError.badRequest("Товар не найден в корзине"));
            }
            if (quantity <= 0) {
                await basketDevice.destroy();
                return res.json({ message: "Товар удалён из корзины" });
            }
            basketDevice.quantity = parseInt(quantity);
            await basketDevice.save();
            return res.json({ message: "Количество обновлено" });
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }

    async removeFromBasket(req, res, next) {
        try {
            const { basketDeviceId } = req.body;
            const basketDevice = await BasketDevice.findOne({ where: { id: basketDeviceId } });
            if (!basketDevice) {
                return next(ApiError.badRequest("Товар не найден в корзине"));
            }
            await basketDevice.destroy();
            return res.json({ message: "Товар удалён из корзины" });
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }

    async checkout(req, res, next) {
        try {
            const { userId } = req.body;
            console.log("Checkout request:", { userId });

            const basket = await Basket.findOne({
                where: { userId },
                include: [{ model: BasketDevice, include: [{ model: Device }] }],
            });
            if (!basket || !basket.basket_devices.length) {
                console.log("Basket is empty for userId:", userId);
                return next(ApiError.badRequest("Корзина пуста"));
            }

            let totalAmount = 0;
            for (const item of basket.basket_devices) {
                totalAmount += item.quantity * item.device.price;
                await Order.create({
                    userId,
                    deviceId: item.deviceId,
                    date: new Date(),
                    amount: item.quantity * item.device.price,
                    status: "PAID",
                });
                console.log(
                    `Created order for deviceId: ${item.deviceId}, amount: ${
                        item.quantity * item.device.price
                    }`
                );
            }

            await BasketDevice.destroy({ where: { basketId: basket.id } });
            console.log(`Cleared basket for userId: ${userId}`);

            return res.json({ message: "Заказ оформлен", totalAmount });
        } catch (e) {
            console.error("Checkout error:", e);
            next(ApiError.badRequest(e.message || "Ошибка оформления заказа"));
        }
    }
}

module.exports = new BasketController();
