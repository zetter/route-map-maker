import React, { useState } from "react";
import { DraggableCore } from "react-draggable";

const DraggableMap = () => {
  const [x, setX] = useState(0)
  const [y, setY] = useState(0)

  const onDrag = (e, {deltaX, deltaY}) => {
    setX(x + deltaX)
    setY(y + deltaY)
  }

  const backgroundPosition = `${x}px ${y}px`

  return (
    <DraggableCore onDrag={onDrag}>
      <div className="rendered-map" style={{backgroundPosition}} />
    </DraggableCore>
  );
}

export default DraggableMap
