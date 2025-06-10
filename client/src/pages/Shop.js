import React, { useContext, useEffect } from "react";
import { Col, Container, Row, Form } from "react-bootstrap";
import TypeBar from "../components/TypeBar";
import BrandBar from "../components/BrandBar";
import DeviceList from "../components/DeviceList";
import { observer } from "mobx-react-lite";
import { Context } from "..";
import { fetchBrands, fetchDevices, fetchTypes } from "../http/deviceAPI";
import Pages from "../components/Pages";

const Shop = observer(() => {
    const { device } = useContext(Context);

    useEffect(() => {
        fetchTypes().then((data) => device.setTypes(data));
        fetchBrands().then((data) => device.setBrands(data));
        fetchDevices(null, null, 1, 2).then((data) => {
            device.setDevices(data.rows);
            device.setTotalCount(data.count);
        });
    }, []);

    useEffect(() => {
        fetchDevices(
            device.selectedType.id,
            device.selectedBrand.id,
            device.page,
            8,
            device.sortBy,
            device.sortOrder
        ).then((data) => {
            device.setDevices(data.rows);
            device.setTotalCount(data.count);
        });
    }, [device.page, device.selectedType, device.selectedBrand, device.sortBy, device.sortOrder]);

    return (
        <Container>
            <Row className="mt-2">
                <Col md={3}>
                    <TypeBar />
                </Col>
                <Col md={9}>
                    <Form.Group className="mb-3">
                        <Form.Label>Сортировать по:</Form.Label>
                        <Form.Select
                            onChange={(e) => {
                                const [sortBy, sortOrder] = e.target.value.split(":");
                                device.setSortBy(sortBy);
                                device.setSortOrder(sortOrder);
                            }}
                        >
                            <option value="name:asc">Название (А-Я)</option>
                            <option value="name:desc">Название (Я-А)</option>
                            <option value="price:asc">Цена (по возрастанию)</option>
                            <option value="price:desc">Цена (по убыванию)</option>
                            <option value="rating:asc">Рейтинг (по возрастанию)</option>
                            <option value="rating:desc">Рейтинг (по убыванию)</option>
                        </Form.Select>
                    </Form.Group>
                    <BrandBar />
                    <DeviceList />
                    <Pages />
                </Col>
            </Row>
        </Container>
    );
});

export default Shop;
