const { Rating, Device } = require("../models/models");
const { Sequelize } = require("sequelize");
const ApiError = require("../error/apiError");

class RatingController {
    async createOrUpdate(req, res, next) {
        let avgRatingResult, newAvgRating;
        try {
            console.log("Rating request:", {
                body: req.body,
                user: req.user,
                headers: req.headers.authorization,
            });

            const { deviceId, rate } = req.body;
            const userId = req.user?.id;

            if (!userId) {
                console.error("No userId in req.user");
                return next(ApiError.unauthorized("Пользователь не аутентифицирован"));
            }

            if (!deviceId || isNaN(deviceId)) {
                console.error("Invalid deviceId:", deviceId);
                return next(ApiError.badRequest("Некорректный deviceId"));
            }

            if (!rate || isNaN(rate) || rate < 0 || rate > 5) {
                console.error("Invalid rate:", rate);
                return next(ApiError.badRequest("Рейтинг должен быть числом от 0 до 5"));
            }

            const parsedDeviceId = parseInt(deviceId);
            const parsedRate = parseInt(rate);

            const device = await Device.findByPk(parsedDeviceId);
            if (!device) {
                console.error("Device not found for deviceId:", parsedDeviceId);
                return next(ApiError.badRequest("Устройство не найдено"));
            }

            console.log("Upserting rating:", {
                userId,
                deviceId: parsedDeviceId,
                rate: parsedRate,
            });
            const [rating, created] = await Rating.upsert(
                { userId, deviceId: parsedDeviceId, rate: parsedRate },
                {
                    conflictFields: ["userId", "deviceId"], // Явно указываем поля конфликта
                    returning: true,
                }
            );

            console.log("Rating upsert result:", { rating, created });

            avgRatingResult = await Rating.findAll({
                where: { deviceId: parsedDeviceId },
                attributes: [[Sequelize.fn("AVG", Sequelize.col("rate")), "avgRating"]],
                raw: true,
            });

            console.log("Average rating result:", avgRatingResult);

            newAvgRating =
                avgRatingResult && avgRatingResult[0] && avgRatingResult[0].avgRating
                    ? Number(parseFloat(avgRatingResult[0].avgRating).toFixed(2))
                    : 0;

            console.log("Updating device with newAvgRating:", {
                deviceId: parsedDeviceId,
                rating: newAvgRating,
            });
            await Device.update({ rating: newAvgRating }, { where: { id: parsedDeviceId } });

            console.log("Device updated successfully");

            return res.json({ rating, avgRating: newAvgRating });
        } catch (e) {
            console.error("Rating createOrUpdate error:", {
                message: e.message,
                stack: e.stack,
                request: { body: req.body, user: req.user },
                avgRatingResult: avgRatingResult || "undefined",
                newAvgRating: newAvgRating || "undefined",
            });
            next(ApiError.internal(`Ошибка при установке рейтинга: ${e.message}`));
        }
    }

    async getUserRating(req, res, next) {
        try {
            console.log("Get user rating request:", {
                params: req.params,
                user: req.user,
            });
            const { deviceId } = req.params;
            const userId = req.user?.id;

            if (!userId) {
                console.error("No userId in req.user");
                return next(ApiError.unauthorized("Пользователь не аутентифицирован"));
            }

            if (!deviceId || isNaN(deviceId)) {
                console.error("Invalid deviceId:", deviceId);
                return next(ApiError.badRequest("Некорректный deviceId"));
            }

            const rating = await Rating.findOne({
                where: { userId, deviceId: parseInt(deviceId) },
            });

            console.log("Get user rating result:", rating);
            return res.json({ rate: rating ? rating.rate : null });
        } catch (e) {
            console.error("Get user rating error:", {
                message: e.message,
                stack: e.stack,
            });
            next(ApiError.internal(`Ошибка при получении рейтинга: ${e.message}`));
        }
    }
}

module.exports = new RatingController();
