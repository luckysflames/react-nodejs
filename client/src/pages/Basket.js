import React, { useContext, useEffect, useState } from "react";
import { Button, Container, Row, Col, Table, Alert, Spinner } from "react-bootstrap";
import { Context } from "../index";
import {
    getBasket,
    updateBasketQuantity,
    removeFromBasket,
    checkoutBasket,
} from "../http/basketAPI";
import { observer } from "mobx-react-lite";

const Basket = observer(() => {
    const { user } = useContext(Context);
    const [basket, setBasket] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [sortField, setSortField] = useState("name");
    const [sortOrder, setSortOrder] = useState("asc");

    useEffect(() => {
        if (user.isAuth) {
            fetchBasket();
        } else {
            setLoading(false);
            setError("Войдите в аккаунт, чтобы просмотреть корзину");
        }
    }, [user.isAuth]);

    const fetchBasket = async () => {
        try {
            setLoading(true);
            const data = await getBasket(user.user.id);
            setBasket(data);
            setError(null);
        } catch (e) {
            setError(e.response?.data?.message || "Ошибка загрузки корзины");
        } finally {
            setLoading(false);
        }
    };

    const handleQuantityChange = async (basketDeviceId, quantity) => {
        try {
            await updateBasketQuantity(basketDeviceId, quantity);
            await fetchBasket();
        } catch (e) {
            setError(e.response?.data?.message || "Ошибка обновления количества");
        }
    };

    const handleRemove = async (basketDeviceId) => {
        try {
            await removeFromBasket(basketDeviceId);
            await fetchBasket();
        } catch (e) {
            setError(e.response?.data?.message || "Ошибка удаления товара");
        }
    };

    const handleCheckout = async () => {
        try {
            const data = await checkoutBasket(user.user.id);
            alert(`Заказ оформлен! Общая сумма: ${data.totalAmount} руб.`);
            await fetchBasket();
        } catch (e) {
            setError(e.response?.data?.message || "Ошибка оформления заказа");
        }
    };

    const handleSort = (field) => {
        setSortField(field);
        setSortOrder(sortField === field && sortOrder === "asc" ? "desc" : "asc");
    };

    if (loading) {
        return <Spinner animation="border" className="d-block mx-auto mt-4" />;
    }

    if (error) {
        return (
            <Alert variant="danger" className="mt-3">
                {error}
            </Alert>
        );
    }

    if (!basket || !basket.basket_devices.length) {
        return (
            <Alert variant="info" className="mt-3">
                Корзина пуста
            </Alert>
        );
    }

    const total = basket.basket_devices.reduce(
        (sum, item) => sum + item.quantity * item.device.price,
        0
    );

    const sortedItems = basket.basket_devices.slice().sort((a, b) => {
        const fieldA =
            sortField === "name"
                ? a.device.name
                : sortField === "price"
                ? a.device.price
                : a.quantity * a.device.price;
        const fieldB =
            sortField === "name"
                ? b.device.name
                : sortField === "price"
                ? b.device.price
                : b.quantity * b.device.price;
        if (sortField === "name") {
            return sortOrder === "asc"
                ? fieldA.localeCompare(fieldB)
                : fieldB.localeCompare(fieldA);
        }
        return sortOrder === "asc" ? fieldA - fieldB : fieldB - fieldA;
    });

    return (
        <Container className="mt-3">
            <h2>Корзина</h2>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>#</th>
                        <th onClick={() => handleSort("name")} style={{ cursor: "pointer" }}>
                            Товар{" "}
                            {sortField === "name" && <span>{sortOrder === "asc" ? "↑" : "↓"}</span>}
                        </th>
                        <th onClick={() => handleSort("price")} style={{ cursor: "pointer" }}>
                            Цена{" "}
                            {sortField === "price" && (
                                <span>{sortOrder === "asc" ? "↑" : "↓"}</span>
                            )}
                        </th>
                        <th>Количество</th>
                        <th onClick={() => handleSort("total")} style={{ cursor: "pointer" }}>
                            Сумма{" "}
                            {sortField === "total" && (
                                <span>{sortOrder === "asc" ? "↑" : "↓"}</span>
                            )}
                        </th>
                        <th>Действия</th>
                    </tr>
                </thead>
                <tbody>
                    {sortedItems.map((item, index) => (
                        <tr key={item.id}>
                            <td>{index + 1}</td>
                            <td>{item.device.name}</td>
                            <td>{item.device.price} руб.</td>
                            <td>
                                <Button
                                    variant="outline-secondary"
                                    size="sm"
                                    onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                                    disabled={item.quantity <= 1}
                                >
                                    -
                                </Button>
                                <span className="mx-2">{item.quantity}</span>
                                <Button
                                    variant="outline-secondary"
                                    size="sm"
                                    onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                                >
                                    +
                                </Button>
                            </td>
                            <td>{item.quantity * item.device.price} руб.</td>
                            <td>
                                <Button
                                    variant="outline-danger"
                                    size="sm"
                                    onClick={() => handleRemove(item.id)}
                                >
                                    Удалить
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
            <Row className="justify-content-end">
                <Col md={4}>
                    <h4>Итого: {total} руб.</h4>
                    <Button variant="success" onClick={handleCheckout}>
                        Оформить заказ
                    </Button>
                </Col>
            </Row>
        </Container>
    );
});

export default Basket;
