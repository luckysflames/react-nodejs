import React, { useState } from "react";
import { Modal, Button, Form, Alert } from "react-bootstrap";
import { createBrand } from "../../http/deviceAPI";

const CreateBrand = ({ show, onHide }) => {
    const [value, setValue] = useState("");
    const [error, setError] = useState("");

    const addBrand = () => {
        if (!value.trim()) {
            setError("Название бренда не может быть пустым");
            return;
        }
        createBrand({ name: value })
            .then(() => {
                setValue("");
                setError("");
                onHide();
            })
            .catch((e) => setError(e.response?.data?.message || "Ошибка добавления бренда"));
    };

    return (
        <Modal show={show} onHide={onHide} size="lg" centered>
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">Добавить бренд</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {error && <Alert variant="danger">{error}</Alert>}
                <Form>
                    <Form.Control
                        placeholder="Введите название бренда"
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                    />
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="outline-danger" onClick={onHide}>
                    Закрыть
                </Button>
                <Button variant="outline-success" onClick={addBrand}>
                    Добавить
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default CreateBrand;
