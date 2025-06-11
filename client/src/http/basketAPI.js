import { $authHost } from "./index";

export const addToBasket = async (userId, deviceId, quantity = 1) => {
    const { data } = await $authHost.post("api/basket/add", { userId, deviceId, quantity });
    return data;
};

export const getBasket = async (userId) => {
    const { data } = await $authHost.get("api/basket", { params: { userId } });
    return data;
};

export const updateBasketQuantity = async (basketDeviceId, quantity) => {
    const { data } = await $authHost.put("api/basket/quantity", { basketDeviceId, quantity });
    return data;
};

export const removeFromBasket = async (basketDeviceId) => {
    const { data } = await $authHost.delete("api/basket/remove", { data: { basketDeviceId } });
    return data;
};

export const checkoutBasket = async (userId) => {
    const { data } = await $authHost.post("api/basket/checkout", { userId });
    return data;
};
