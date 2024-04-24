/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { Stage, Layer, Line, Circle, Text, Label, Tag } from 'react-konva';
import { update } from 'three/examples/jsm/libs/tween.module.js';
import { v4 as uuidv4 } from 'uuid';

const Floor = ({lines, setLines, mode}) => {
   
    const [tempLine, setTempLine] = useState(null);
    const [drawing, setDrawing] = useState(false); // 新增了一個狀態變量用於標記是否正在繪製線
    const [deleteMode, setDeleteMode] = useState(false)
    const [selectedLineIndex, setSelectedLineIndex] = useState(null);
    const [mousePosition, setMousePosition] = useState()
    
    const gridSize = 20;


    const snapToGrid = (x, y) => {
        return [Math.round(x / gridSize) * gridSize, Math.round(y / gridSize) * gridSize];
    };

    const handleMouseDown = (e) => {
        if( mode === "drawing")
        {
            const stage = e.target.getStage();
            const mousePos = stage.getPointerPosition();
            const snappedPos = snapToGrid(mousePos.x, mousePos.y);
            setDrawing(true);
            setTempLine([snappedPos[0], snappedPos[1], snappedPos[0], snappedPos[1]]);
        }
    };


    const handleMouseMove = (e) => {
        if (drawing && mode === "drawing") {
            const stage = e.target.getStage();
            const mousePos = stage.getPointerPosition();
            const snappedPos = snapToGrid(mousePos.x, mousePos.y);
            setTempLine([tempLine[0], tempLine[1], snappedPos[0], snappedPos[1]]);
        }
    };

    const handleMouseUp = () => {
        if (drawing  && mode === "drawing") {
            setDrawing(false);
            setLines([...lines, tempLine]);
            setTempLine([]);
        }
    };

    const drawGrid = () => {
        const grid = [];
        for (let i = 0; i < window.innerWidth; i += gridSize) {
            grid.push(<Line points={[i, 0, i, window.innerHeight]} stroke="#ddd" strokeWidth={0.5} />);
        }

        for (let i = 0; i < window.innerHeight; i += gridSize) {
            grid.push(<Line points={[0, i, window.innerWidth, i]} stroke="#ddd" strokeWidth={0.5} />);
        }

        return grid;
    };

    const calculateLength = (line) => {
        const dx = line[2] - line[0];
        const dy = line[3] - line[1];
        return (Math.sqrt(dx * dx + dy * dy)).toFixed(0);
    };

    const drawDimensionLine = (line) => {
        const midPoint = [(line[0] + line[2]) / 2, (line[1] + line[3]) / 2];
        const length = calculateLength(line);
        
        return (
            <>
               {length !== "NaN" && length !== "0" ?  <Text x={midPoint[0]+4} y={midPoint[1]+4} text={`${length} mm`} fontSize={15} fill="black" /> : null}
            </>
        );
    };


    const handleDeleteLine = (index) => {
        if ( mode === "deleting")
        {
            const newLines = lines.filter((_, i) => i !== index)
            setLines(newLines)
        }
    }
    
    // const calculateAngle = (line1, line2) => {
    //     const v1 = { x: line1[2] - line1[0], y: line1[3] - line1[1] };
    //     const v2 = { x: line2[2] - line2[0], y: line2[3] - line2[1] };

    //     const dotProduct = v1.x * v2.x + v1.y * v2.y;
    //     const magnitude1 = Math.sqrt(v1.x * v1.x + v1.y * v1.y);
    //     const magnitude2 = Math.sqrt(v2.x * v2.x + v2.y * v2.y);

    //     const angleInRadians = Math.acos(dotProduct / (magnitude1 * magnitude2));
    //     const angleInDegrees = angleInRadians * (180 / Math.PI);

    //     return angleInDegrees.toFixed(2);
    // };

    // const drawAngle = (line1, line2) => {
    //     const angle = calculateAngle(line1, line2);
    //     const position = { x: line1[2], y: line1[3] };

    //     return (
    //         <Text
    //             x={position.x}
    //             y={position.y}
    //             text={`${angle}°`}
    //             fontSize={15}
    //         />
    //     );
    // };




    const findIntersections = () => {
        const intersections = [];
      
        lines.forEach((line1, i) => {
          const [x1, y1, x2, y2] = line1;
      
          lines.slice(i + 1).forEach((line2) => {
            const [x3, y3, x4, y4] = line2;
      
            const denominator = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);
      
            if (denominator === 0) return;
      
            const t = ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) / denominator;
            const u = -((x1 - x2) * (y1 - y3) - (y1 - y2) * (x1 - x3)) / denominator;
      
            if (t >= 0 && t <= 1 && u >= 0 && u <= 1) {
              const intersectionX = x1 + t * (x2 - x1);
              const intersectionY = y1 + t * (y2 - y1);
              const intersectionPoint = { x: intersectionX, y: intersectionY };
      
              // 檢查是否已存在相同的交點，如果不存在則加入 intersections 中
              if (!intersections.some((point) => point.x === intersectionX && point.y === intersectionY)) {
                intersections.push(intersectionPoint);
              }
            }
          });
        });
        
        return intersections;
      };
      
    
    
     const intersection = findIntersections()

    // console.log("Intersection");
    // console.log(intersection);

    const handleDragStart = (index) => {
        if( mode === "Moving")
        {
            setSelectedLineIndex(index);
        }
    };

    const handleLineDragEnd = (e) => {
        if(mode === "Moving"){
            const stage = e.target.getStage();
            const mousePos = stage.getPointerPosition();
            const snappedPos = snapToGrid(mousePos.x , mousePos.y );
            
            const mouseDifference = [snappedPos[0] - mousePosition[0], snappedPos[1] - mousePosition[1]]

            // const start = snapToGrid(mousePos.x - ( mousePos.x - lines[selectedLineIndex][0]), mousePos.y - ( mousePos.y - lines[selectedLineIndex][1]))
            // const end = snapToGrid(mousePos.x - ( mousePos.x - lines[selectedLineIndex][2]), mousePos.y - ( mousePos.y - lines[selectedLineIndex][3]))

            // console.log("SnappedPos")
            // console.log(snappedPos)
            const updatedLines = [...lines];
            updatedLines[selectedLineIndex] = [
                lines[selectedLineIndex][0] + mouseDifference[0] ,
                lines[selectedLineIndex][1] + mouseDifference[1] ,
                lines[selectedLineIndex][2] + mouseDifference[0] ,
                lines[selectedLineIndex][3] + mouseDifference[1] ,
            ]
            // updatedLines[selectedLineIndex] = [
            //     snappedPos[0] - (lines[selectedLineIndex][2] - lines[selectedLineIndex][0]) / 2,
            //     snappedPos[1] - (lines[selectedLineIndex][3] - lines[selectedLineIndex][1]) / 2,
            //     snappedPos[0] + (lines[selectedLineIndex][2] - lines[selectedLineIndex][0]) / 2,
            //     snappedPos[1] + (lines[selectedLineIndex][3] - lines[selectedLineIndex][1]) / 2
            // ];
            // updatedLines[selectedLineIndex] = [
            //     ...start,     
            //     ...end,
            // ]
            console.log("updatedLines")
            console.log(updatedLines)
            setLines(updatedLines);
            setSelectedLineIndex(null);
        }
    };
    
   const handleStartDragEnd = (e) => {
        if( mode === "Moving")
        {
            const stage = e.target.getStage();
            const mousePos = stage.getPointerPosition();
            const snappedPos = snapToGrid(mousePos.x , mousePos.y );
            const updateLine = [...lines] 
            updateLine[selectedLineIndex] = [snappedPos[0], snappedPos[1] , updateLine[selectedLineIndex][2], updateLine[selectedLineIndex][3]]
            setLines(updateLine)
        }
    }

    const handleBackDragEnd = (e) => {
        if( mode === "Moving")
        {
            const stage = e.target.getStage();
            const mousePos = stage.getPointerPosition();
            const snappedPos = snapToGrid(mousePos.x , mousePos.y );
            const updateLine = [...lines] 
            updateLine[selectedLineIndex] = [updateLine[selectedLineIndex][0], updateLine[selectedLineIndex][1], snappedPos[0], snappedPos[1]]
            setLines(updateLine)
        }
        
   }

    return (
        <Stage 
            width={window.innerWidth} 
            height={window.innerHeight}  
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            
        >
            <Layer>
                {drawGrid()}
                {console.log("Lines:")}
                {console.log(lines)}
                {lines.map((line, index) => (
                    <>
                        <Line
                            key={index}
                            points={line}
                            stroke="blue"
                            strokeWidth={5}
                            onClick={() => {handleDeleteLine(index)}}
                        />
                        <Circle 
                        key={index+1111} x={line[0]} y={line[1]} radius={5} fill="black"
                        onDragStart={() => handleDragStart(index)}
                        onDragEnd={(e) => handleStartDragEnd(e)}
                        draggable={mode === "Moving" ? true : false}
                        />
                        <Circle 
                        key={index+20000} x={line[2]} y={line[3]} radius={5} fill="black"
                        onDragStart={() => handleDragStart(index)}
                        onDragEnd={(e) => handleBackDragEnd(e)}
                        draggable={mode === "Moving" ? true : false}
                        />
                       {drawDimensionLine(line, `${index}-dimension`)}
                    </>
                ))}
                {/* {lines.slice(0, -1).map((line, index) => (
                    drawAngle(line, lines[index + 1])
                ))} */}
                {tempLine && (
                    <React.Fragment key="tempLine">
                        <Line points={tempLine} stroke="red" strokeWidth={5} key={uuidv4()} />
                        {drawDimensionLine(tempLine, 'tempLine-dimension')}
                        {/* {lines.length > 0 && drawAngle(lines[lines.length - 1], tempLine)} */}
                    </React.Fragment>
                )}
                {intersection.map((point, i) => (
                    <Circle key={i} x={point.x} y={point.y} radius={5} fill="red" />
                ))}
                
                {/* <Label x={200} y={200} onClick={deleteSelectedLine}>
                        <Tag fill="white" pointerDirection="down" pointerWidth={10} pointerHeight={10} lineJoin="round" shadowColor="white" />
                        <Text text="Delete Selected Line" padding={5} fill="black" />
                    </Label> 
                */}
            </Layer>
        </Stage>
    );
};

export default Floor;