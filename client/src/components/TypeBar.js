import React, { useContext, useState } from "react";
import { observer } from "mobx-react-lite";
import { Context } from "..";
import { ListGroup } from "react-bootstrap";

const TypeBar = observer(() => {
    const { device } = useContext(Context);
    const [allButton, setAllButton] = useState(true);
    return (
        <ListGroup>
            <ListGroup.Item
                style={{ cursor: "pointer" }}
                onClick={() => {
                    device.setSelectedType("");
                    setAllButton(true);
                }}
                active={allButton}
            >
                Все
            </ListGroup.Item>
            {device.types.map((type) => (
                <ListGroup.Item
                    style={{ cursor: "pointer" }}
                    key={type.id}
                    onClick={() => {
                        device.setSelectedType(type);
                        setAllButton(false);
                    }}
                    active={type.id === device.selectedType.id}
                >
                    {type.name}
                </ListGroup.Item>
            ))}
        </ListGroup>
    );
});

export default TypeBar;
