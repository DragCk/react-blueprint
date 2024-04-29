/* eslint-disable react/prop-types */
import { Line, Circle } from 'react-konva';
import React from 'react';

const Grid = ({gridSize, width, height}) => {
     // 定義網格大小
    const gridWidth = width; // 網格寬度
    const gridHeight = height; // 網格高度
    
    const lines = [];
    
    
  
    // 水平網格線
    for (let y = 0; y < gridHeight; y += gridSize) {
      lines.push(
        <Line
          key={`line_h_${y}`}
          points={[0, y, gridWidth, y]}
          stroke="#ddd"
          strokeWidth={1}
        />
      );
    }
      // 垂直網格線
    for (let x = 0; x < gridWidth; x += gridSize) {
      
      lines.push(
        <Line
          key={`line_v_${x}`}
          points={[x, 0, x, gridHeight]}
          stroke={"#ddd"}
          strokeWidth={1}
        />
      );
    }
  
    return (
    <React.Fragment>
        {lines}
        <Circle 
          x={Math.round((width/2) / gridSize) * gridSize} 
          y={Math.round((height/2) / gridSize) * gridSize} 
          radius={10} 
          fill='red'
        />
    </React.Fragment>);
  };

  export default Grid