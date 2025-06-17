const sequelize = require("../database/db");
const { DataTypes } = require("sequelize");

const User = sequelize.define("user", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    email: { type: DataTypes.STRING, unique: true, allowNull: false },
    password: { type: DataTypes.STRING, allowNull: false },
    role: { type: DataTypes.STRING, defaultValue: "USER" },
    createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    updatedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
});

const Device = sequelize.define("device", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, unique: true, allowNull: false },
    price: { type: DataTypes.INTEGER, allowNull: false },
    rating: { type: DataTypes.FLOAT, defaultValue: 0 },
    img: { type: DataTypes.STRING, allowNull: false },
    createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    updatedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
});

const Type = sequelize.define(
    "type",
    {
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        name: { type: DataTypes.STRING, unique: true, allowNull: false },
    },
    { timestamps: false }
);

const Brand = sequelize.define(
    "brand",
    {
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        name: { type: DataTypes.STRING, unique: true, allowNull: false },
    },
    { timestamps: false }
);

const Rating = sequelize.define(
    "rating",
    {
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        rate: { type: DataTypes.FLOAT, allowNull: false },
    },
    {
        timestamps: false,
        indexes: [
            {
                unique: true,
                fields: ["userId", "deviceId"],
                name: "unique_user_device_rating",
            },
        ],
    }
);

const DeviceInfo = sequelize.define(
    "device_info",
    {
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        title: { type: DataTypes.STRING, allowNull: false },
        description: { type: DataTypes.STRING, allowNull: false },
    },
    { timestamps: false, tableName: "device_info" }
);

const TypeBrand = sequelize.define(
    "type_brand",
    {
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    },
    { timestamps: false, tableName: "type_brand" }
);

const Basket = sequelize.define("basket", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    userId: { type: DataTypes.INTEGER, unique: true },
});

const BasketDevice = sequelize.define("basket_device", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    quantity: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1 },
});

const Order = sequelize.define("order", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    userId: { type: DataTypes.INTEGER, allowNull: false },
    deviceId: { type: DataTypes.INTEGER, allowNull: false },
    amount: { type: DataTypes.INTEGER, allowNull: false },
    status: { type: DataTypes.STRING, allowNull: false, defaultValue: "PAID" },
    createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    updatedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
});

User.hasMany(Rating);
Rating.belongsTo(User);

Type.hasMany(Device);
Device.belongsTo(Type);

Brand.hasMany(Device);
Device.belongsTo(Brand);

Device.hasMany(Rating);
Rating.belongsTo(Device);

Device.hasMany(DeviceInfo, { as: "info" });
DeviceInfo.belongsTo(Device);

Type.belongsToMany(Brand, { through: TypeBrand });
Brand.belongsToMany(Type, { through: TypeBrand });

User.hasMany(Order);
Order.belongsTo(User);

Device.hasMany(Order);
Order.belongsTo(Device);

User.hasOne(Basket);
Basket.belongsTo(User);

Basket.hasMany(BasketDevice);
BasketDevice.belongsTo(Basket);

Device.hasMany(BasketDevice);
BasketDevice.belongsTo(Device);

module.exports = {
    User,
    Device,
    Type,
    Brand,
    Rating,
    DeviceInfo,
    TypeBrand,
    Order,
    Basket,
    BasketDevice,
};
