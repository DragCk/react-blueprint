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
    const [drawing, setDrawing] = useState(false);
    const [selectedLineIndex, setSelectedLineIndex] = useState(null);
    const [selectedIntersectionPoint, setSelectedIntersectionPoint] = useState({x:0, y:0})
    const [lineMoving, setLineMoving] = useState(false)

    const stageRef = useRef()
    const circleRef = useRef()

    const { mode } = useSelector((state) => state.mode)
    const { lines } = useSelector((state) => state.lines)
    const dispatch = useDispatch()
    
    const gridSize = 20;
    const gridTableSize = 4000

    /* ----------Drawing lines----------- */

    const snapToGrid = (x, y) => {
        return [Math.round(x / gridSize) * gridSize, Math.round(y / gridSize) * gridSize];
    };

    const handleMouseDown = (e) => {
        if( mode !== "Drawing") return
        
        const stage = e.target?.getStage();
        const mousePos = stage.getRelativePointerPosition();
        const snappedPos = snapToGrid(mousePos.x, mousePos.y);
        setDrawing(true);
        setTempLine([snappedPos[0], snappedPos[1], snappedPos[0], snappedPos[1]]);
        
    };

    const handleMouseMove = (e) => {
        if (!drawing) return

        const stage = e.target?.getStage();
        const mousePos = stage.getRelativePointerPosition();
        const snappedPos = snapToGrid(mousePos.x, mousePos.y);
        setTempLine([tempLine[0], tempLine[1], snappedPos[0], snappedPos[1]]);
    };

    const handleMouseUp = () => {
        if (!drawing) return

        setDrawing(false);
        if(tempLine[0] !== tempLine[2] || tempLine[1] !== tempLine[3]) 
        {
            dispatch(setNewLines(tempLine))
        }
        setTempLine([]);
    };

    /* ----------Grid create----------- */
    
    const drawGrid = () => {
        const grid = [];
        const halfSize = gridTableSize / 2;
        
        for (let i = -halfSize; i <= halfSize; i += gridSize) {
            const strokeWidth = i % (gridSize * 5) === 0 ? 2 : 0.5;
            grid.push(<Line key={`${i}-y`} points={[i, -halfSize, i, halfSize]} stroke="#ddd" strokeWidth={strokeWidth} />);
        }
    
        for (let i = -halfSize; i <= halfSize; i += gridSize) {
            const strokeWidth = i % (gridSize * 5) === 0 ? 2 : 0.5;
            grid.push(<Line key={`${i}-x`} points={[-halfSize, i, halfSize, i]} stroke="#ddd" strokeWidth={strokeWidth} />);
        }
    
        return grid;
    };


    /* ----------Distance of Line----------- */
    const calculateLength = (x1, y1, x2, y2) => {
        const dx = x2 - x1;
        const dy = y2 - y1;
        return (Math.sqrt(dx * dx + dy * dy)).toFixed(0);
        
    };

    const drawDimensionLine = (line, index) => {
        const [x1, y1, x2, y2] = line
        const midPoint = [(x1 + x2) / 2, (y1 + y2) / 2];
        const length = calculateLength(x1, y1, x2, y2);
        
        return (
            <>
               {length !== "NaN" && length !== "0" ? 
               (<Label x={midPoint[0]-22} y={midPoint[1]-7} key={`${index}-dimension`} onClick={() => handleDeleteLine(index)} >
                    <Tag fill="white" lineJoin="round" cornerRadius={10} />
                    <Text text={`${length}mm`} padding={2} fill="black" />
                </Label> )
               
               : null}
            </>
        );
    };

    /* ----------Deleting Lines----------- */

    const handleDeleteLine = (index) => {
        if ( mode !== "deleting") return
        
        const newLines = lines.filter((_, i) => i !== index)
        dispatch(setAfterDelete(newLines))
        
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
                
                // 檢查起點是否重疊
                if ((x1 === x3 && y1 === y3) || (x1 === x4 && y1 === y4)) {
                    const exists = overlappingPoints.some(point => point.x === x1 && point.y === y1);
                    if (!exists) {
                        overlappingPoints.push({ x: x1, y: y1});
                    }
                }
                // 檢查終點是否重疊
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

    /* ----------Start/End intersection point dragging----------- */
    
    const handleIntersectionMouseDown = (e) => {
        if(mode !== "Moving") return
            
        const {x, y} = e.target?.attrs
        setSelectedIntersectionPoint({x, y})
        setLineMoving(true)
        
    }

    const handleIntesectionMouseMove = (e) => {
        if(!lineMoving) return

        console.log("Movingggg")
        const {x, y} = e.target?.attrs
        
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


    const hadleIntersectionMouseUp = (e) => {
        
        if(!lineMoving) return 
            
        const {x, y} = e.target?.attrs
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
        if( mode !== "Moving") return
        
        setSelectedLineIndex(index);
        
    };

    const handleOnDrag = (e, position) => {
        if( mode !== "Moving") return 

        const {x, y} = e.target?.attrs
        const updateLine = [...lines] 
        
        if(position === "start")
        {updateLine[selectedLineIndex] = [x, y, updateLine[selectedLineIndex][2], updateLine[selectedLineIndex][3]]}
        if( position === "end")
        {updateLine[selectedLineIndex] = [updateLine[selectedLineIndex][0], updateLine[selectedLineIndex][1],x, y]}
        dispatch(setAfterDelete(updateLine))
        
    }

    const handleDragEnd = (e, position) => {
        if( mode !== "Moving") return 

        const {x, y} = e.target?.attrs
        const snappedPos = snapToGrid(x, y);
        const updateLine = [...lines]

        if(position === "start")
        {updateLine[selectedLineIndex] = [snappedPos[0], snappedPos[1] , updateLine[selectedLineIndex][2], updateLine[selectedLineIndex][3]]}
        if(position === "end")
        {updateLine[selectedLineIndex] = [updateLine[selectedLineIndex][0], updateLine[selectedLineIndex][1], snappedPos[0], snappedPos[1]]}
        dispatch(setAfterDelete(updateLine))
        setSelectedLineIndex(null)
        
    }

   
    /* ----------Line Dragging by Body----------- */
    const handleLineMove = (e, index) => {
        const {x, y} = e.target?.position()
        const snappedPos = snapToGrid(x, y)
        console.log(`Move x : ${snappedPos[0]}, y: ${snappedPos[1]}`)
        
        const updateLines = [...lines]
        
        updateLines[index] = [
            updateLines[index][0] + snappedPos[0], 
            updateLines[index][1] + snappedPos[1], 
            updateLines[index][2] + snappedPos[0], 
            updateLines[index][3] + snappedPos[1]
        ]
        //Line position solve with https://stackoverflow.com/questions/73631342/konva-line-drag
        e.target.position({ x: 0, y: 0 })
        dispatch(setAfterDelete(updateLines))
    }

    /* ----------Calculations----------- */

    const calculateStageOffSet = (window) => {
        return (-(window) / 2)
    }

    const calculationPositionFromCenter = () => {
        return (circleRef.current.getAbsolutePosition(stageRef.current))
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
            width={4000} 
            height={4000} 
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            ref={stageRef}
            draggable={mode === "Moving" ? true : false}
            offsetX={calculateStageOffSet(windowWidth)}
            offsetY={calculateStageOffSet(windowHeight)}
        >
            <Layer>
                {/* ------------Default Grid and center drawing---------------- */}
                {lines && drawGrid()}
        
                <Circle ref={circleRef} x={0} y={0} radius={5} fill="red"/>
                {/* ------------Default Grid and center drawing---------------- */}
            </Layer>

            <Layer >

                {/* ------------Line drawing---------------- */}
                {lines.map((line, index) => (
                    <>
                        <Line
                            key={index}
                            points={line}
                            stroke="blue"
                            strokeWidth={5}
                            onClick={() => handleDeleteLine(index)}
                            draggable={mode === "Moving" ? true : false}
                            onDragEnd={e => handleLineMove(e,index)}
                            hitStrokeWidth={10}
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
                {/* ------------Line drawing---------------- */}


                {/* {lines.slice(0, -1).map((line, index) => (
                    drawAngle(line, lines[index + 1])
                ))} */}

                
                {/* ------------Templine drawing---------------- */}
                {tempLine && (
                    <React.Fragment key="tempLine">
                        <Line points={tempLine} stroke="red" strokeWidth={5} key={uuidv4()} />
                        {drawDimensionLine(tempLine, 'tempLine-dimension')}
                        {/* {lines.length > 0 && drawAngle(lines[lines.length - 1], tempLine)} */}
                    </React.Fragment>
                )}
                {/* ------------Templine drawing---------------- */}


                {/* {intersection.map((point, i) => (
                    <Circle key={`${i}-intersection`} x={point.x} y={point.y} radius={5} fill="red" />
                ))} */}
                
                {/* ---------------Start/end point intersection drawing---------------- */}
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
                {/* ---------------Start/end point intersection drawing---------------- */}


            </Layer>
        </Stage>
    );
};

export default Floor;