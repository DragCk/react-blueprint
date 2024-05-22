import React, { useRef, useState, useEffect } from 'react';
import { Stage, Layer, Circle, Line } from 'react-konva';

const DraggableCircle = React.forwardRef(({ x, y, color, onDragMove }, ref) => (
  <Circle
    x={x}
    y={y}
    radius={10}
    fill={color}
    draggable
    ref={ref}
    onDragMove={onDragMove}
  />
));

const App = () => {
  const [circles, setCircles] = useState([]);
  const [lines, setLines] = useState([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentLine, setCurrentLine] = useState([]);
  const [startPoint, setStartPoint] = useState({ x: 0, y: 0 });

  const handleStageClick = (e) => {
    if (!isDrawing) {
      setCurrentLine([]);
      setIsDrawing(true);
      const stage = e.target.getStage();
      const pointerPosition = stage.getPointerPosition();
      setStartPoint(pointerPosition);
    }

    const stage = e.target.getStage();
    const pointerPosition = stage.getPointerPosition();

    const newCircle = {
      id: `circle-${circles.length}`,
      x: pointerPosition.x,
      y: pointerPosition.y,
      ref: React.createRef()
    };

    setCircles((prevCircles) => [...prevCircles, newCircle]);
    setCurrentLine((prevLine) => [...prevLine, newCircle]);

    if (currentLine.length > 0) {
      const from = startPoint;
      const to = newCircle;
      setLines((prevLines) => [
        ...prevLines,
        { points: [from.x, from.y, to.x, to.y] }
      ]);
    }
  };

  const handleEscKey = (e) => {
    if (e.key === 'Escape') {
      setIsDrawing(false);
      setCurrentLine([]);
    }
  };

  const updateLines = (updatedCircles) => {
    const newLines = [];
    for (let i = 0; i < updatedCircles.length - 1; i++) {
      const from = updatedCircles[i];
      const to = updatedCircles[i + 1];
      newLines.push({
        points: [from.x, from.y, to.x, to.y]
      });
    }
    setLines(newLines);
  };

  const handleDragMove = (index, e) => {
    const updatedCircles = circles.slice();
    updatedCircles[index] = {
      ...updatedCircles[index],
      x: e.target.x(),
      y: e.target.y()
    };
    setCircles(updatedCircles);
    setCurrentLine((prevLine) => {
      const updatedLine = prevLine.slice();
      updatedLine[index] = {
        ...updatedLine[index],
        x: e.target.x(),
        y: e.target.y()
      };
      return updatedLine;
    });
    if (index === 0) {
      setStartPoint({ x: e.target.x(), y: e.target.y() });
    }
    updateLines(updatedCircles);
  };

  useEffect(() => {
    window.addEventListener('keydown', handleEscKey);
    return () => {
      window.removeEventListener('keydown', handleEscKey);
    };
  }, []);

  return (
    <Stage width={window.innerWidth} height={window.innerHeight} onClick={handleStageClick}>
      <Layer>
        {circles.map((circle, index) => (
          <DraggableCircle
            key={circle.id}
            x={circle.x}
            y={circle.y}
            color="red"
            ref={circle.ref}
            onDragMove={(e) => handleDragMove(index, e)}
          />
        ))}
        {lines.map((line, index) => (
          <Line key={index} points={line.points} stroke="#666666" strokeWidth={2} />
        ))}
      </Layer>
    </Stage>
  );
};

export default App;

