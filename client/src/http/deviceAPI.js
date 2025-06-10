import { $authHost, $host } from ".";

export const createType = async (type) => {
    const { data } = await $authHost.post("api/type", type);
    return data;
};

export const fetchTypes = async () => {
    const { data } = await $host.get("api/type");
    return data;
};

export const createBrand = async (brand) => {
    const { data } = await $authHost.post("api/brand", brand);
    return data;
};

export const fetchBrands = async () => {
    const { data } = await $host.get("api/brand");
    return data;
};

export const createDevice = async (device) => {
    const { data } = await $authHost.post("api/device", device);
    return data;
};

export const fetchDevices = async (
    typeId,
    brandId,
    page,
    limit = 5,
    sortBy = "name",
    sortOrder = "asc"
) => {
    const { data } = await $host.get("api/device", {
        params: {
            typeId,
            brandId,
            page,
            limit,
            sortBy,
            sortOrder,
        },
    });
    return data;
};

export const fetchOneDevice = async (id) => {
    const { data } = await $host.get("api/device/" + id);
    return data;
};

export const fetchOrderAnalytics = async (period) => {
    const { data } = await $host.get("api/order/analytics", {
        params: { period },
    });
    return data;
};

export const exportOrders = async () => {
    const { data } = await $authHost.get("api/order/export");
    return data;
};

export const fetchNoOrderPeriods = async (period) => {
    const { data } = await $authHost.get("api/order/no-orders", {
        params: { period },
    });
    return data;
};

export const fetchPeakOrderPeriod = async (period) => {
    const { data } = await $authHost.get("api/order/peak-period", {
        params: { period },
    });
    return data;
};
