import React, { useContext } from "react";
import { observer } from "mobx-react-lite";
import { Context } from "..";
import { ListGroup } from "react-bootstrap";

const TypeBar = observer(() => {
  const { device } = useContext(Context);
  return (
    <ListGroup>
      {device.types.map((type) => (
        <ListGroup.Item
          style={{ cursor: "pointer" }}
          key={type.id}
          onClick={() => device.setSelectedType(type)}
          active={type.id === device.selectedType.id}
        >
          {type.name}
        </ListGroup.Item>
      ))}
    </ListGroup>
  );
});

export default TypeBar;
