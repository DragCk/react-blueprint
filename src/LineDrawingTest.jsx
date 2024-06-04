import React, { useState } from 'react';
import { Stage, Layer, Circle, Line } from 'react-konva';

const App = () => {
  const [circles, setCircles] = useState([]);
  const [lines, setLines] = useState([]);
  const [tempLine, setTempLine] = useState(null)
  const [prevPoint, setPrevPoint] = useState(null);
  const radius = 10;
  const proximityThreshold = 15; // Adjust this value as needed for proximity checking

  const handleMouseDown = (e) => {
    const stage = e.target.getStage();
    const mousePos = stage.getRelativePointerPosition();
    let closestCircle = null;
    let minDistance = proximityThreshold;

    // Find the closest circle
    for (const circle of circles) {
      const dx = mousePos.x - circle[0];
      const dy = mousePos.y - circle[1];
      const distance = Math.sqrt(dx * dx + dy * dy);
      if (distance < minDistance) {
        closestCircle = circle;
        minDistance = distance;
      }
    }

    // If a circle is close enough, start the line from that circle
    if (closestCircle) {
      if (prevPoint) {
        const newLine = [...prevPoint, closestCircle[0], closestCircle[1]];
        setLines((prevLines) => [...prevLines, newLine]);
        setPrevPoint(null);
      } else {
        setPrevPoint(closestCircle);
      }

    } else {
      // Otherwise, create a new circle and start a new line from there
      const newCircle = [mousePos.x, mousePos.y];
      setCircles((prevCircles) => [...prevCircles, newCircle]);

      if (prevPoint) {
        const newLine = [...prevPoint, mousePos.x, mousePos.y];
        setLines((prevLines) => [...prevLines, newLine]);
      }
      setPrevPoint([mousePos.x, mousePos.y]);
    }
  };

  return (
    <Stage
      width={window.innerWidth}
      height={window.innerHeight}
      onMouseDown={handleMouseDown}
    >
      <Layer>
        {lines.map((line, index) => (
          <Line key={index} points={line} draggable stroke="red" strokeWidth={5} />
        ))}
        {circles.map((circle, index) => (
          <Circle key={index} x={circle[0]} y={circle[1]} radius={radius} fill="blue" />
        ))}
        {console.log(lines)}
      </Layer>
    </Stage>
  );
};

export default App;
