const uuid = require("uuid");
const path = require("path");
const { Device, DeviceInfo } = require("../models/models");
const ApiError = require("../error/apiError");

class DeviceController {
    async create(req, res, next) {
        try {
            let { name, price, brandId, typeId, info } = req.body;
            const { img } = req.files;
            let fileName = uuid.v4() + ".jpg";
            img.mv(path.resolve(__dirname, "..", "static", fileName));
            const device = await Device.create({
                name,
                price,
                brandId,
                typeId,
                img: fileName,
            });

            if (info) {
                info = JSON.parse(info);
                info.forEach((el) => {
                    DeviceInfo.create({
                        title: el.title,
                        description: el.description,
                        deviceId: device.id,
                    });
                });
            }

            return res.json(device);
        } catch (error) {
            next(ApiError.badRequest(error.message));
        }
    }

    async getAll(req, res) {
        let { brandId, typeId, limit, page, sortBy, sortOrder } = req.query;
        page = page || 1;
        limit = limit || 9;
        let offset = page * limit - limit;
        let devices;

        const validSortFields = ["name", "price", "rating"];
        const validSortOrders = ["asc", "desc"];
        sortBy = validSortFields.includes(sortBy) ? sortBy : "name";
        sortOrder = validSortOrders.includes(sortOrder) ? sortOrder : "asc";

        const order = [[sortBy, sortOrder.toUpperCase()]];

        if (!brandId && !typeId) {
            devices = await Device.findAndCountAll({ limit, offset, order });
        } else if (brandId && !typeId) {
            devices = await Device.findAndCountAll({
                where: { brandId },
                limit,
                offset,
                order,
            });
        } else if (!brandId && typeId) {
            devices = await Device.findAndCountAll({
                where: { typeId },
                limit,
                offset,
                order,
            });
        } else if (brandId && typeId) {
            devices = await Device.findAndCountAll({
                where: { typeId, brandId },
                limit,
                offset,
                order,
            });
        }
        return res.json(devices);
    }

    async getOne(req, res) {
        const { id } = req.params;
        const device = await Device.findOne({
            where: { id },
            include: [{ model: DeviceInfo, as: "info" }],
        });
        return res.json(device);
    }
}

module.exports = new DeviceController();
