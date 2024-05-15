/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useEffect, useRef, useState } from 'react';
import { Stage, Layer, Line, Circle, Text, Label, Tag } from 'react-konva';
import { v4 as uuidv4 } from 'uuid';
import { useSelector, useDispatch } from 'react-redux';

import { setNewLines, setAfterDelete } from "../redux/features/lines"


const Floor = () => {
    const [windowWidth, setWindowWidth] = useState(0)
    const [windowHeight, setWindowHeight] = useState(0)
    const [tempLine, setTempLine] = useState(null);
    const [drawing, setDrawing] = useState(false); // 新增了一個狀態變量用於標記是否正在繪製線
    const [selectedLineIndex, setSelectedLineIndex] = useState(null);
    const [selectedIntersectionPoint, setSelectedIntersectionPoint] = useState({x:0, y:0})
    const [lineMoving, setLineMoving] = useState(false)

    const stageRef = useRef()
    const circleRef = useRef()

    const { mode } = useSelector((state) => state.mode)
    const { lines } = useSelector((state) => state.lines)
    const dispatch = useDispatch()
    
    
    const gridSize = 20;
    const gridTableSize = 6000

    /* ----------Drawing lines----------- */

    const snapToGrid = (x, y) => {
        return [Math.round(x / gridSize) * gridSize, Math.round(y / gridSize) * gridSize];
    };

    const handleMouseDown = (e) => {
        console.log(circleRef.current.getAbsolutePosition(stageRef.current))
        if( mode === "Drawing")
        {
            const stage = e.target.getStage();
            const mousePos = stage.getPointerPosition();
            const snappedPos = snapToGrid(mousePos.x, mousePos.y);
            setDrawing(true);
            setTempLine([snappedPos[0], snappedPos[1], snappedPos[0], snappedPos[1]]);
        }
    };

    const handleMouseMove = (e) => {
        if (drawing) {
            const stage = e.target.getStage();
            const mousePos = stage.getPointerPosition();
            const snappedPos = snapToGrid(mousePos.x, mousePos.y);
            setTempLine([tempLine[0], tempLine[1], snappedPos[0], snappedPos[1]]);
        }
    };

    const handleMouseUp = () => {
        if (drawing) {
            setDrawing(false);

            if(tempLine[0] !== tempLine[2] || tempLine[1] !== tempLine[3]) 
            {
                // setLines([...lines, tempLine]);
                dispatch(setNewLines(tempLine))
            }
            
            setTempLine([]);
        }
        
    };

    /* ----------Draw Grid----------- */

    const drawGrid = () => {
        const grid = [];
        for (let i = 0; i < gridTableSize; i += gridSize) {
            const strokesWidth = i % (gridSize * 5) === 0 ? 2 : 0.5
            grid.push(<Line key={`${i}-y`} points={[i, 0, i, gridTableSize]} stroke="#ddd" strokeWidth={strokesWidth} />);
        }

        for (let i = 0; i < gridTableSize; i += gridSize) {
            const strokesWidth = i % (gridSize * 5) === 0 ? 2 : 0.5
            grid.push(<Line key={`${i}-x`} points={[0, i,gridTableSize, i]} stroke="#ddd" strokeWidth={strokesWidth} />);
        }

        return grid;
    };

    /* ----------Draw length of Line----------- */
    const calculateLength = (line) => {
        
        const dx = line[2] - line[0];
        const dy = line[3] - line[1];
        return (Math.sqrt(dx * dx + dy * dy)).toFixed(0);
        
    };

    const drawDimensionLine = (line, index) => {
        
        const midPoint = [(line[0] + line[2]) / 2, (line[1] + line[3]) / 2];
        const length = calculateLength(line);
        
        return (
            <>
               {length !== "NaN" && length !== "0" ? 
               (//<Text x={midPoint[0]+4} y={midPoint[1]+4} text={`${length} mm`} fontSize={15} fill="black" />
            
               <Label x={midPoint[0]-22} y={midPoint[1]-7} key={`${index}-dimension`} onClick={() => handleDeleteLine(index)} >
                    <Tag fill="white" lineJoin="round" cornerRadius={10} />
                    <Text text={`${length}mm`} padding={2} fill="black" />
                </Label> 
                )
               
               : null}
            </>
        );
    };

    /* ----------Deleting Lines----------- */

    const handleDeleteLine = (index) => {324
        if ( mode === "deleting")
        {
            const newLines = lines.filter((_, i) => i !== index)
            dispatch(setAfterDelete(newLines))
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

    /* ----------Intersections on start & end point-------------- */
    const findPointIntersections = () => {
        const overlappingPoints = []
        lines.forEach((line1, i) => {
            const [x1, y1, x2, y2] = line1;
        
            lines.slice(i + 1).forEach((line2) => {
                const [x3, y3, x4, y4] = line2;
        
                if ((x1 === x3 && y1 === y3) || (x1 === x4 && y1 === y4)) {
                    const exists = overlappingPoints.some(point => point.x === x1 && point.y === y1);
                    if (!exists) {
                        overlappingPoints.push({ x: x1, y: y1});
                    }
                }
                // 检查终点是否重叠
                if ((x2 === x3 && y2 === y3) || (x2 === x4 && y2 === y4)) {
                    const exists = overlappingPoints.some(point => point.x === x2 && point.y === y2);
                    if (!exists) {
                        overlappingPoints.push({ x: x2, y: y2});
                    }
                }
                
                });
          });
          return overlappingPoints
    }

    const points = findPointIntersections()
    // console.log("points")
    // console.log(points)
    /* ----------Intersections----------- */
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

    /* ----------Line Dragging by point----------- */
    const handleDragStart = (index) => {
        if( mode === "Moving")
        {
            
            setSelectedLineIndex(index);
        }
    };

    const handleOnDrag = (e, position) => {
        if( mode === "Moving"){
            const {x, y} = e.target.attrs
            
            const updateLine = [...lines] 
            
            if(position === "start")
            {updateLine[selectedLineIndex] = [x, y, updateLine[selectedLineIndex][2], updateLine[selectedLineIndex][3]]}
            if( position === "end")
            {updateLine[selectedLineIndex] = [updateLine[selectedLineIndex][0], updateLine[selectedLineIndex][1],x, y]}
            dispatch(setAfterDelete(updateLine))
        }
    }

    const handleDragEnd = (e, position) => {
        if( mode === "Moving"){
            const {x, y} = e.target.attrs
            const snappedPos = snapToGrid(x, y);
            const updateLine = [...lines] 
            if(position === "start")
            {updateLine[selectedLineIndex] = [snappedPos[0], snappedPos[1] , updateLine[selectedLineIndex][2], updateLine[selectedLineIndex][3]]}
            if( position === "end")
            {updateLine[selectedLineIndex] = [updateLine[selectedLineIndex][0], updateLine[selectedLineIndex][1], snappedPos[0], snappedPos[1]]}
            dispatch(setAfterDelete(updateLine))
            setSelectedLineIndex(null)
        } 
    }


    
    const handleIntersectionMouseDown = (e) => {
        if(mode === "Moving"){
            
            const {x, y} = e.target.attrs
            setSelectedIntersectionPoint({x, y})
            setLineMoving(true)
        }
    }

    const handleIntesectionMouseMove = (e) => {
        if(lineMoving) {
            console.log("Movingggg")
            const {x, y} = e.target.attrs
            
            const updateLines = [...lines]
            updateLines.map((line) =>{
                if(line[0] <= selectedIntersectionPoint.x + 5 && line[0] >= selectedIntersectionPoint.x - 5){
                    if(line[1] <= selectedIntersectionPoint.y + 5 && line[1] >= selectedIntersectionPoint.y - 5)
                    {
                        line[0] = x
                        line[1] = y
                    }
                } 
                if(line[2] <= selectedIntersectionPoint.x + 5 && line[2] >= selectedIntersectionPoint.x - 5){
                    if(line[3] <= selectedIntersectionPoint.y + 5 && line[3] >= selectedIntersectionPoint.y - 5)
                { 
                        line[2] = x
                        line[3] = y
                    }
                } 
            })
            setLines(updateLines)  
        }
    } 


    const hadleIntersectionMouseUp = (e) => {
        
        if(lineMoving){
            
            const {x, y} = e.target.attrs
            const snappedPos = snapToGrid(x , y);
            const updateLines = lines.map((line) =>{
                
                if(line[0] <= selectedIntersectionPoint.x + 5 && line[0] >= selectedIntersectionPoint.x - 5){
                    if(line[1] <= selectedIntersectionPoint.y + 5 && line[1] >= selectedIntersectionPoint.y - 5)
                    {
                        return [snappedPos[0], snappedPos[1], line[2], line[3]];
                    }
                } 
                if(line[2] <= selectedIntersectionPoint.x + 5 && line[2] >= selectedIntersectionPoint.x - 5){
                    if(line[3] <= selectedIntersectionPoint.y + 5 && line[3] >= selectedIntersectionPoint.y - 5)
                    { 
                    return [line[0], line[1], snappedPos[0], snappedPos[1]];
                    }
                } 
                return line;
            })

            dispatch(setAfterDelete(updateLines))
            setLineMoving(false)
        }
        
    }

    /* ----------Line Dragging by Body----------- */
    const handleLineMove = (e) => {
        const {x, y} = e.target.attrs
        console.log(e.target.absolutePosition())
        console.log(`Line: x: ${x}, y:${y}`)
    }


    const calculateStageOffSet = (window) => {
        return (gridTableSize - window) / 2
    }

    /* ----------Konva stage resizing----------- */
    const handleResize = () => {
        setWindowWidth(window.innerWidth)
        setWindowHeight(window.innerHeight)
    }

    useEffect(() => {
        window.addEventListener("resize", handleResize);
        handleResize();
        return () => window.removeEventListener("resize", handleResize)
    }, [])


    return (
        <Stage 
            width={6000} 
            height={6000} 
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            ref={stageRef}
            draggable
            offsetX={calculateStageOffSet(windowWidth)}
            offsetY={calculateStageOffSet(windowHeight)}
        >
            <Layer>

                {lines && drawGrid()}
              
                <Circle ref={circleRef} x={gridTableSize/2} y={gridTableSize/2} radius={5} fill="red"/>

                
                {lines.map((line, index) => (
                    <>
                        <Line
                            key={index}
                            points={line}
                            stroke="blue"
                            strokeWidth={5}
                            onClick={() => handleDeleteLine(index)}

                        />
                        <Circle 
                            key={`${index}-start`} x={line[0]} y={line[1]} radius={5} fill="black"
                            onDragStart={() => handleDragStart(index)}
                            onDragMove={(e) => handleOnDrag(e,"start") }
                            onDragEnd={(e) => handleDragEnd(e,"start")}
                            draggable={mode === "Moving" ? true : false}
                            
                        />
                        <Circle 
                            key={`${index}-end`} x={line[2]} y={line[3]} radius={5} fill="black"
                            onDragStart={() => handleDragStart(index)}
                            onDragMove={(e) => handleOnDrag(e,"end") }
                            onDragEnd={(e) => handleDragEnd(e,"end")}
                            draggable={mode === "Moving" ? true : false}
                            
                        />
                        {drawDimensionLine(line, index)}
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

                {/* {intersection.map((point, i) => (
                    <Circle key={`${i}-intersection`} x={point.x} y={point.y} radius={5} fill="red" />
                ))} */}
                

                {points.map((point, index) => (
                <Circle 
                    key={`${index}-points`} 
                    x={point.x}
                    y={point.y} 
                    radius={6} 
                    fill="red" 
                    draggable={mode === "Moving" ? true : false}
                    onDragStart={handleIntersectionMouseDown}
                    onDragEnd={hadleIntersectionMouseUp}
                    />
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