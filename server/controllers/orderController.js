const { Order, User, Device } = require("../models/models");
const { Sequelize } = require("sequelize");

class OrderController {
    async getAnalytics(req, res) {
        const { period } = req.query;
        let groupBy, dateFormat;

        if (period === "month") {
            groupBy = Sequelize.fn("date_trunc", "month", Sequelize.col("createdAt"));
            dateFormat = "YYYY-MM";
        } else if (period === "quarter") {
            groupBy = Sequelize.fn("date_trunc", "quarter", Sequelize.col("createdAt"));
            dateFormat = "YYYY-Q";
        } else {
            return res.status(400).json({ message: "Неверный период" });
        }

        try {
            const analytics = await Order.findAll({
                attributes: [
                    [groupBy, "period"],
                    [Sequelize.fn("COUNT", Sequelize.col("id")), "count"],
                ],
                group: ["period"],
                order: [[Sequelize.col("period"), "ASC"]],
            });

            const labels = analytics.map((item) =>
                new Date(item.dataValues.period).toLocaleDateString("ru-RU", {
                    year: "numeric",
                    month: period === "month" ? "long" : undefined,
                    quarter: period === "quarter" ? "numeric" : undefined,
                })
            );
            const data = analytics.map((item) => item.dataValues.count);

            return res.json({ labels, data });
        } catch (e) {
            console.error("Analytics error:", e);
            res.status(500).json({ message: "Ошибка сервера" });
        }
    }

    async exportOrders(req, res) {
        try {
            const orders = await Order.findAll({
                include: [
                    { model: User, attributes: ["email"] },
                    { model: Device, attributes: ["name", "price"] },
                ],
                order: [["createdAt", "ASC"]],
            });

            let csv = "ID, Email пользователя, Устройство, Цена, Дата создания\n";
            orders.forEach((order) => {
                csv += `${order.id}, ${order.user.email}, ${order.device.name}, ${order.device.price}, ${order.createdAt}\n`;
            });

            res.setHeader("Content-Type", "text/csv; charset=utf-8");
            res.setHeader("Content-Disposition", "attachment; filename=orders.csv");
            return res.send(csv);
        } catch (e) {
            console.error("Export error:", e);
            res.status(500).json({ message: "Ошибка при экспорте данных" });
        }
    }

    async getNoOrderPeriods(req, res) {
        try {
            const { period } = req.query;
            let groupBy;

            if (period === "month") {
                groupBy = Sequelize.fn("date_trunc", "month", Sequelize.col("createdAt"));
            } else if (period === "quarter") {
                groupBy = Sequelize.fn("date_trunc", "quarter", Sequelize.col("createdAt"));
            } else {
                return res.status(400).json({ message: "Неверный период" });
            }

            const allOrders = await Order.findAll({
                attributes: [[groupBy, "period"]],
                group: ["period"],
            });

            const allPeriods = [];
            const startDate = new Date("2024-01-01");
            const endDate = new Date("2024-12-31");
            let currentDate = startDate;

            while (currentDate <= endDate) {
                if (period === "month") {
                    const year = currentDate.getFullYear();
                    const month = String(currentDate.getMonth() + 1).padStart(2, "0");
                    allPeriods.push(`${year}-${month}`);
                } else {
                    const year = currentDate.getFullYear();
                    const quarter = Math.ceil((currentDate.getMonth() + 1) / 3);
                    allPeriods.push(`${year}-Q${quarter}`);
                }
                currentDate.setMonth(currentDate.getMonth() + (period === "month" ? 1 : 3));
            }

            const orderPeriods = allOrders.map((item) => {
                const date = new Date(item.dataValues.period);
                if (period === "month") {
                    const year = date.getFullYear();
                    const month = String(date.getMonth() + 1).padStart(2, "0");
                    return `${year}-${month}`;
                } else {
                    const year = date.getFullYear();
                    const quarter = Math.ceil((date.getMonth() + 1) / 3);
                    return `${year}-Q${quarter}`;
                }
            });

            const noOrderPeriods = allPeriods
                .filter((p) => !orderPeriods.includes(p))
                .map((p) => {
                    if (period === "month") {
                        const [year, month] = p.split("-");
                        return new Date(year, month - 1).toLocaleDateString("ru-RU", {
                            year: "numeric",
                            month: "long",
                        });
                    } else {
                        const [year, q] = p.split("-Q");
                        return `Квартал ${q} ${year}`;
                    }
                });

            return res.json({ periods: noOrderPeriods });
        } catch (e) {
            console.error("No order periods error:", e);
            res.status(500).json({ message: "Ошибка сервера" });
        }
    }

    async getPeakOrderPeriod(req, res) {
        try {
            const { period } = req.query;
            let groupBy;

            if (period === "month") {
                groupBy = Sequelize.fn("date_trunc", "month", Sequelize.col("createdAt"));
            } else if (period === "quarter") {
                groupBy = Sequelize.fn("date_trunc", "quarter", Sequelize.col("createdAt"));
            } else {
                return res.status(400).json({ message: "Неверный период" });
            }

            const orders = await Order.findAll({
                attributes: [
                    [groupBy, "period"],
                    [Sequelize.fn("COUNT", Sequelize.col("id")), "count"],
                ],
                group: ["period"],
                order: [[Sequelize.col("count"), "DESC"]],
                limit: 1,
            });

            if (orders.length === 0) {
                return res.json({ period: null, count: 0 });
            }

            const peakPeriod = orders[0].dataValues.period;
            const formattedPeriod =
                period === "month"
                    ? new Date(peakPeriod).toLocaleDateString("ru-RU", {
                          year: "numeric",
                          month: "long",
                      })
                    : `Квартал ${Math.ceil((new Date(peakPeriod).getMonth() + 1) / 3)} ${new Date(
                          peakPeriod
                      ).getFullYear()}`;

            return res.json({ period: formattedPeriod, count: orders[0].dataValues.count });
        } catch (e) {
            console.error("Peak period error:", e);
            res.status(500).json({ message: "Ошибка сервера" });
        }
    }
}

module.exports = new OrderController();
