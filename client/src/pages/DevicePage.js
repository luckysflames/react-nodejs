import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Col, Container, Image, Row, Table } from "react-bootstrap";
import { Context } from "../index";
import { fetchOneDevice } from "../http/deviceAPI";
import { createOrUpdateRating, getUserRating } from "../http/deviceAPI";
import { addToBasket } from "../http/basketAPI";
import { observer } from "mobx-react-lite";
import { LOGIN_ROUTE } from "../utils/consts";

const DevicePage = observer(() => {
    const { user, device: deviceStore } = useContext(Context);
    const { id } = useParams();
    const [device, setDevice] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [userRating, setUserRating] = useState(null);
    const [hoverRating, setHoverRating] = useState(null);
    const [ratingLoading, setRatingLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        fetchDevice();
        if (user.isAuth && user.user.role === "USER") {
            fetchUserRating();
        }
    }, [id, user.isAuth, user.user.role]);

    const fetchDevice = async () => {
        try {
            setLoading(true);
            const data = await fetchOneDevice(id);
            setDevice(data);
            setError(null);
        } catch (e) {
            setError(e.response?.data?.message || "Ошибка загрузки устройства");
        } finally {
            setLoading(false);
        }
    };

    const fetchUserRating = async () => {
        try {
            const { rate } = await getUserRating(id);
            setUserRating(rate);
            deviceStore.setRating(id, device?.rating, rate);
        } catch (e) {
            setError(e.response?.data?.message || "Ошибка загрузки рейтинга");
        }
    };

    const handleRating = async (rate) => {
        if (!user.isAuth || user.user.role !== "USER") return;
        try {
            setRatingLoading(true);
            const { avgRating } = await createOrUpdateRating(id, rate);
            setUserRating(rate);
            deviceStore.setRating(id, avgRating, rate);
            setDevice((prev) => ({ ...prev, rating: avgRating }));
            setError(null);
        } catch (e) {
            setError(e.response?.data?.message || "Ошибка установки рейтинга");
        } finally {
            setRatingLoading(false);
        }
    };

    const handleAddToBasket = async () => {
        if (!user.isAuth) {
            navigate(LOGIN_ROUTE);
            return;
        }
        try {
            await addToBasket(user.user.id, id);
            alert("Товар добавлен в корзину!");
        } catch (e) {
            alert(e.response?.data?.message || "Ошибка добавления в корзину");
        }
    };

    const renderStars = () => {
        const stars = [];
        const currentRating = hoverRating || userRating || device?.rating || 0;
        for (let i = 1; i <= 5; i++) {
            stars.push(
                <span
                    key={i}
                    style={{
                        cursor:
                            user.isAuth && user.user.role === "USER" && !ratingLoading
                                ? "pointer"
                                : "default",
                        opacity: ratingLoading ? 0.5 : 1,
                        fontSize: "24px",
                        color: i <= Math.round(currentRating) ? "#ffc107" : "#ccc",
                    }}
                    onMouseEnter={() =>
                        user.isAuth &&
                        user.user.role === "USER" &&
                        !ratingLoading &&
                        setHoverRating(i)
                    }
                    onMouseLeave={() =>
                        user.isAuth &&
                        user.user.role === "USER" &&
                        !ratingLoading &&
                        setHoverRating(null)
                    }
                    onClick={() => handleRating(i)}
                >
                    {i <= Math.round(currentRating) ? "★" : "☆"}
                </span>
            );
        }
        return stars;
    };

    if (loading) {
        return <div className="text-center mt-5">Загрузка...</div>;
    }

    if (error) {
        return <div className="text-danger text-center mt-5">{error}</div>;
    }

    if (!device) {
        return <div className="text-center mt-5">Устройство не найдено</div>;
    }

    return (
        <Container className="mt-3">
            <Row>
                <Col md={4}>
                    <Image
                        src={process.env.REACT_APP_API_URL + device.img}
                        style={{ width: "100%", height: "auto", objectFit: "contain" }}
                    />
                </Col>
                <Col md={4}>
                    <h2>{device.name}</h2>
                    <div>
                        Рейтинг: {device.rating ? device.rating : "Нет оценок"} ({renderStars()})
                        {error && <div className="text-danger mt-1">{error}</div>}
                    </div>
                    <div className="mt-3">
                        <h4>Цена: {device.price} руб.</h4>
                        <Button
                            variant="outline-primary"
                            onClick={handleAddToBasket}
                            disabled={ratingLoading}
                        >
                            Добавить в корзину
                        </Button>
                    </div>
                </Col>
                <Col md={4}>
                    <Table striped bordered hover size="sm">
                        <thead>
                            <tr>
                                <th>Характеристика</th>
                                <th>Значение</th>
                            </tr>
                        </thead>
                        <tbody>
                            {device.info?.map((info) => (
                                <tr key={info.id}>
                                    <td>{info.title}</td>
                                    <td>{info.description}</td>
                                </tr>
                            ))}
                            {!device.info?.length && (
                                <tr>
                                    <td colSpan={2}>Характеристики отсутствуют</td>
                                </tr>
                            )}
                        </tbody>
                    </Table>
                </Col>
            </Row>
        </Container>
    );
});

export default DevicePage;
