import { makeAutoObservable } from "mobx";

export default class DeviceStore {
    constructor() {
        this._types = [];
        this._brands = [];
        this._devices = [];
        this._selectedType = {};
        this._selectedBrand = {};
        this._page = 1;
        this._totalCount = 0;
        this._limit = 8;
        this._ratings = {};
        this._sortBy = "name";
        this._sortOrder = "asc";
        makeAutoObservable(this);
    }

    setTypes(types) {
        this._types = types;
    }

    setBrands(brands) {
        this._brands = brands;
    }

    setDevices(devices) {
        this._devices = devices;
    }

    setSelectedType(type) {
        this._selectedType = type;
        this.setPage(1);
    }

    setSelectedBrand(brand) {
        this._selectedBrand = brand;
        this.setPage(1);
    }

    setPage(page) {
        this._page = page;
    }

    setTotalCount(count) {
        this._totalCount = count;
    }

    setRating(deviceId, avgRating, userRating = null) {
        this._ratings[deviceId] = { avgRating, userRating };
    }

    setSortBy(sortBy) {
        this._sortBy = sortBy;
    }

    setSortOrder(sortOrder) {
        this._sortOrder = sortOrder;
    }

    get types() {
        return this._types;
    }

    get brands() {
        return this._brands;
    }

    get devices() {
        return this._devices;
    }

    get selectedType() {
        return this._selectedType;
    }

    get selectedBrand() {
        return this._selectedBrand;
    }

    get totalCount() {
        return this._totalCount;
    }

    get page() {
        return this._page;
    }

    get limit() {
        return this._limit;
    }

    get sortBy() {
        return this._sortBy;
    }

    get sortOrder() {
        return this._sortOrder;
    }
}
