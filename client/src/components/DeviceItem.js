import React, { useContext, useEffect, useState } from "react";
import { Card, Button, Image } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { DEVICE_ROUTE } from "../utils/consts";
import { Context } from "../index";
import { addToBasket } from "../http/basketAPI";
import { createOrUpdateRating, getUserRating } from "../http/deviceAPI";

const DeviceItem = ({ device }) => {
    const { user, device: deviceStore } = useContext(Context);
    const navigate = useNavigate();
    const [userRating, setUserRating] = useState(null);
    const [hoverRating, setHoverRating] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (user.isAuth && user.user.role === "USER") {
            fetchUserRating();
        }
    }, [user.isAuth, user.user.role, device.id]);

    const fetchUserRating = async () => {
        try {
            const { rate } = await getUserRating(device.id);
            setUserRating(rate);
            deviceStore.setRating(device.id, device.rating, rate);
        } catch (e) {
            setError(e.response?.data?.message || "Ошибка загрузки рейтинга");
        }
    };

    const handleAddToBasket = async () => {
        try {
            await addToBasket(user.user.id, device.id);
            alert("Товар добавлен в корзину!");
        } catch (e) {
            alert(e.response?.data?.message || "Ошибка добавления в корзину");
        }
    };

    return (
        <Card className="mt-3" style={{ width: "18rem" }}>
            <Card.Img
                variant="top"
                src={process.env.REACT_APP_API_URL + device.img}
                style={{ height: "200px", objectFit: "contain", cursor: "pointer" }}
                onClick={() => navigate(DEVICE_ROUTE + "/" + device.id)}
            />
            <Card.Body>
                <Card.Title>{device.name}</Card.Title>
                <Card.Text>
                    Цена: {device.price} руб.
                    <br />
                    Рейтинг: {device.rating || "Нет оценок"}
                    {error && <div className="text-danger mt-1">{error}</div>}
                </Card.Text>
                <Button variant="outline-primary" onClick={handleAddToBasket} disabled={loading}>
                    Добавить в корзину
                </Button>
            </Card.Body>
        </Card>
    );
};

export default DeviceItem;
