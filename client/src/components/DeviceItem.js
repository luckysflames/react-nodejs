import React from "react";
import { Card, Col, Image } from "react-bootstrap";
import star from "../assets/star.svg";
import { useNavigate } from "react-router-dom";
import { DEVICE_ROUTE } from "../utils/consts";

const DeviceItem = ({ device }) => {
    const history = useNavigate();
    return (
        <Col md={3} className="mt-3" onClick={() => history(DEVICE_ROUTE + "/" + device.id)}>
            <Card style={{ width: 150, cursor: "pointer" }} border="light">
                <div style={{width: 150, height: 150, overflow: "hidden"}}>
                    <Image
                        width={150}
                        src={process.env.REACT_APP_API_URL + device.img}
                    />
                </div>
                <div className="d-flex align-items-center">
                    <div>{device.name}</div>
                    <Image width={18} height={18} src={star} style={{ marginLeft: "auto" }} />
                    <div>{device.rating}</div>
                </div>
                <div>{device.price}$</div>
            </Card>
        </Col>
    );
};

export default DeviceItem;
