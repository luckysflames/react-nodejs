import React, { useContext } from "react";
import { Context } from "..";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { NavLink, useNavigate } from "react-router-dom";
import { ADMIN_ROUTE, ANALYTICS_ROUTE, LOGIN_ROUTE, SHOP_ROUTE } from "../utils/consts";
import { Button } from "react-bootstrap";
import { observer } from "mobx-react-lite";

const NavBar = observer(() => {
    const { user } = useContext(Context);
    const history = useNavigate();

    const logOut = () => {
        user.setUser({});
        user.setIsAuth(false);
    };

    console.log("User state:", user.user, "IsAuth:", user.isAuth);

    return (
        <Navbar bg="dark" data-bs-theme="dark">
            <Container>
                <NavLink style={{ color: "white" }} to={SHOP_ROUTE}>
                    КупиДевайс
                </NavLink>
                {user.isAuth ? (
                    <Nav className="ms-auto" style={{ color: "white" }}>
                        {user.role === "ADMIN" && (
                            <>
                                <Button
                                    variant={"outline-light"}
                                    onClick={() => history(ADMIN_ROUTE)}
                                >
                                    Админ панель
                                </Button>
                                <Button
                                    variant={"outline-light"}
                                    onClick={() => history(ANALYTICS_ROUTE)}
                                    className="ms-2"
                                >
                                    Аналитика
                                </Button>
                            </>
                        )}
                        <Button variant={"outline-light"} onClick={() => logOut()} className="ms-4">
                            Выйти
                        </Button>
                    </Nav>
                ) : (
                    <Nav className="ms-auto" style={{ color: "white" }}>
                        <Button variant="outline-light" onClick={() => history(LOGIN_ROUTE)}>
                            Авторизация
                        </Button>
                    </Nav>
                )}
            </Container>
        </Navbar>
    );
});

export default NavBar;
