// src/pages/Auth.js
import React, { useContext, useState } from "react";
import { Button, Card, Col, Container, Form, Row } from "react-bootstrap";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { LOGIN_ROUTE, REGISTRATION_ROUTE, SHOP_ROUTE } from "../utils/consts";
import { login, registration } from "../http/userAPI";
import { observer } from "mobx-react-lite";
import { Context } from "..";

const Auth = observer(() => {
    const { user } = useContext(Context);
    const location = useLocation();
    const history = useNavigate();
    const isLogin = location.pathname === LOGIN_ROUTE;
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState({});

    const validateForm = () => {
        const newErrors = {};
        if (!email) newErrors.email = "Email обязателен";
        else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = "Некорректный email";
        if (!password) newErrors.password = "Пароль обязателен";
        else if (password.length < 4)
            newErrors.password = "Пароль должен быть не короче 6 символов";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const click = async () => {
        if (!validateForm()) return;
        try {
            let data;
            if (isLogin) {
                data = await login(email, password);
            } else {
                data = await registration(email, password);
            }
            user.setUser({ id: data.id, email: data.email, role: data.role });
            user.setIsAuth(true);
            history(SHOP_ROUTE);
        } catch (e) {
            alert(e.response.data.message);
        }
    };

    return (
        <Container
            className="d-flex justify-content-center align-items-center"
            style={{ height: window.innerHeight - 54 }}
        >
            <Card style={{ width: 600 }} className="p-5">
                <h2 className="m-auto">{isLogin ? "Авторизация" : "Регистрация"}</h2>
                <Form className="d-flex flex-column">
                    <Form.Control
                        className="mt-3"
                        placeholder="Введите ваш email..."
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <Form.Control
                        className="mt-3"
                        placeholder="Введите ваш пароль..."
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        type="password"
                    />
                    <Row>
                        <Col className="d-flex justify-content-between align-items-center mt-3 ph-3">
                            {isLogin ? (
                                <div>
                                    Нет аккаунта?{" "}
                                    <NavLink to={REGISTRATION_ROUTE}>Зарегистрируйтесь!</NavLink>
                                </div>
                            ) : (
                                <div>
                                    Есть аккаунт? <NavLink to={LOGIN_ROUTE}>Войдите!</NavLink>
                                </div>
                            )}
                            <Button variant="outline-success" onClick={click}>
                                {isLogin ? "Войти" : "Регистрация"}
                            </Button>
                        </Col>
                    </Row>
                </Form>
            </Card>
        </Container>
    );
});

export default Auth;
