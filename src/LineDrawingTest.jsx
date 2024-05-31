import React, { useState } from "react";
import { render } from "react-dom";
import { Stage, Layer, Line, Rect } from "react-konva";

const App = () => {
  const [points, setPoints] = useState([]);
  const [curMousePos, setCurMousePos] = useState([0, 0]);
  const [isMouseOverStartPoint, setIsMouseOverStartPoint] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  const getMousePos = stage => {
    return [stage.getPointerPosition().x, stage.getPointerPosition().y];
  };

  const handleClick = event => {
    const stage = event.target.getStage();
    const mousePos = getMousePos(stage);

    if (isFinished) {
      return;
    }
    if (isMouseOverStartPoint && points.length >= 3) {
      setIsFinished(true);
    } else {
      setPoints([...points, mousePos]);
    }
  };

  const handleMouseMove = event => {
    const stage = event.target.getStage();
    const mousePos = getMousePos(stage);
    setCurMousePos(mousePos);
  };

  const handleMouseOverStartPoint = event => {
    if (isFinished || points.length < 3) return;
    event.target.scale({ x: 2, y: 2 });
    setIsMouseOverStartPoint(true);
  };

  const handleMouseOutStartPoint = event => {
    event.target.scale({ x: 1, y: 1 });
    setIsMouseOverStartPoint(false);
  };

  const handleDragStartPoint = event => {
    console.log("start", event);
  };

  const handleDragMovePoint = event => {
    const index = event.target.index - 1;
    const pos = [event.target.attrs.x, event.target.attrs.y];
    const newPoints = [...points];
    newPoints[index] = pos;
    setPoints(newPoints);
  };

  const handleDragEndPoint = event => {
    console.log("end", event);
  };

  const flattenedPoints = points
    .concat(isFinished ? [] : curMousePos)
    .reduce((a, b) => a.concat(b), []);

  console.log(points)
  return (
    <Stage
      width={window.innerWidth}
      height={window.innerHeight}
      onMouseDown={handleClick}
      onMouseMove={handleMouseMove}
    >
      <Layer>
        <Line
          points={flattenedPoints}
          stroke="black"
          strokeWidth={5}
          closed={isFinished}
          draggable
        />
        
        
        {points.map((point, index) => {
          const width = 6;
          const x = point[0] - width / 2;
          const y = point[1] - width / 2;
          const startPointAttr =
            index === 0
              ? {
                  hitStrokeWidth: 12,
                  onMouseOver: handleMouseOverStartPoint,
                  onMouseOut: handleMouseOutStartPoint
                }
              : null;
          return (
            <Rect
              key={index}
              x={x}
              y={y}
              width={width}
              height={width}
              fill="white"
              stroke="black"
              strokeWidth={3}
              onDragStart={handleDragStartPoint}
              onDragMove={handleDragMovePoint}
              onDragEnd={handleDragEndPoint}
              draggable
              {...startPointAttr}
            />
          );
        })}
      </Layer>
    </Stage>
  );
};

export default App;
