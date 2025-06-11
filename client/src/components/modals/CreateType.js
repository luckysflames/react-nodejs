import React, { useState } from "react";
import { Modal, Button, Form, Alert } from "react-bootstrap";
import { createType } from "../../http/deviceAPI";

const CreateType = ({ show, onHide }) => {
    const [value, setValue] = useState("");
    const [error, setError] = useState("");

    const addType = () => {
        if (!value.trim()) {
            setError("Название типа не может быть пустым");
            return;
        }
        createType({ name: value })
            .then(() => {
                setValue("");
                setError("");
                onHide();
            })
            .catch((e) => setError(e.response?.data?.message || "Ошибка добавления типа"));
    };

    return (
        <Modal show={show} onHide={onHide} size="lg" centered>
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">Добавить тип</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {error && <Alert variant="danger">{error}</Alert>}
                <Form>
                    <Form.Control
                        placeholder="Введите название типа"
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                    />
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="outline-danger" onClick={onHide}>
                    Закрыть
                </Button>
                <Button variant="outline-success" onClick={addType}>
                    Добавить
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default CreateType;
