import React, { useContext, useState } from "react";
import { observer } from "mobx-react-lite";
import { Context } from "..";
import { Card, Col, Row } from "react-bootstrap";

const BrandBar = observer(() => {
    const { device } = useContext(Context);
    const [allButton, setAllButton] = useState(true);
    return (
        <Row>
            <Col className="d-flex">
                <Card
                    style={{ cursor: "pointer", display: "flex", alignItems: "center" }}
                    className="p-3"
                    onClick={() => {
                        device.setSelectedBrand("");
                        setAllButton(true);
                    }}
                    border={allButton ? "danger" : "light"}
                >
                    Все
                </Card>
                {device.brands.map((brand) => (
                    <Card
                        style={{ cursor: "pointer" }}
                        key={brand.id}
                        className="p-3"
                        onClick={() => {
                            device.setSelectedBrand(brand);
                            setAllButton(false);
                        }}
                        border={brand.id === device.selectedBrand.id ? "danger" : "light"}
                    >
                        {brand.name}
                    </Card>
                ))}
            </Col>
        </Row>
    );
});

export default BrandBar;
