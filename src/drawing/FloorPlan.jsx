/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useEffect, useRef, useState, useCallback } from 'react';
import _ from 'lodash';
import { Stage, Layer, Line, Circle, Text, Label, Tag , Node} from 'react-konva';
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
    const [tempLinePoints, setTempLinePoints] = useState(null)

    const stageRef = useRef()

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
        const [snapX, snapY] = snapToGrid(mousePos.x, mousePos.y);
        setDrawing(true);
        setTempLine([snapX, snapY, snapX, snapY]);
        
    };

    const handleMouseMove = (e) => {
        if (!drawing) return
        
        const stage = e.target?.getStage();
        const mousePos = stage.getRelativePointerPosition();
        const [snapX, snapY]  = snapToGrid(mousePos.x, mousePos.y);
        setTempLine([tempLine[0], tempLine[1], snapX, snapY]);
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

        const createLine = (key, points, strokeWidth) => (
            <Line key={key} points={points} stroke="#ddd" strokeWidth={strokeWidth} />
        );

        for (let i = -halfSize; i <= halfSize; i += gridSize) {
            const strokeWidth = i % (gridSize * 5) === 0 ? 2 : 0.5;
            
            // Vertical line drawing
            grid.push(createLine(`${i}-y`, [i, -halfSize, i, halfSize], strokeWidth));
            
            // Horizontal line drawing
            grid.push(createLine(`${i}-x`, [-halfSize, i, halfSize, i], strokeWidth));
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
        const overlappingPoints = [];
        const pointsSet = new Set();
    
        const addPointIfNotExists = (x, y) => {
            const pointKey = `${x},${y}`;
            if (!pointsSet.has(pointKey)) {
                pointsSet.add(pointKey);
                overlappingPoints.push({ x, y });
            }
        };
    
        lines.forEach((line1, i) => {
            const [x1, y1, x2, y2] = line1;
    
            lines.slice(i + 1).forEach((line2) => {
                const [x3, y3, x4, y4] = line2;
    
                // Check if start point ovelaps
                if ((x1 === x3 && y1 === y3) || (x1 === x4 && y1 === y4)) {
                    addPointIfNotExists(x1, y1);
                }
    
                // Check if end point ovelaps
                if ((x2 === x3 && y2 === y3) || (x2 === x4 && y2 === y4)) {
                    addPointIfNotExists(x2, y2);
                }
            });
        });
    
        return overlappingPoints;
    }

    const points = findPointIntersections()

    /* ----------Start/End intersection point dragging----------- */
    
    const handleIntersectionMouseDown = (e) => {
        if(mode !== "Moving") return
            
        const {x, y} = e.target?.attrs
        setSelectedIntersectionPoint({x, y})
        setLineMoving(true)
        
    }

    // const handleIntesectionMouseMove = (e) => {
    //     if(!lineMoving) return

    //     console.log("Movingggg")
    //     const {x, y} = e.target?.attrs
        
    //     const updateLines = [...lines]
    //     updateLines.map((line) =>{
    //         let [x1,y1,x2,y2] = line
    //         if(x1 <= selectedIntersectionPoint.x + 5 && x1 >= selectedIntersectionPoint.x - 5){
    //             if(y1 <= selectedIntersectionPoint.y + 5 && y1 >= selectedIntersectionPoint.y - 5)
    //             {
    //                 x1 = x
    //                 y1 = y
    //             }
    //         } 
    //         if(x2 <= selectedIntersectionPoint.x + 5 && x2 >= selectedIntersectionPoint.x - 5){
    //             if(y2 <= selectedIntersectionPoint.y + 5 && y2 >= selectedIntersectionPoint.y - 5)
    //         { 
    //                 x2 = x
    //                 y2 = y
    //             }
    //         } 
    //     })
    //     setLines(updateLines)  
        
    // } 


    const hadleIntersectionMouseUp = (e) => {
        
        if (!lineMoving) return;
    
        const { x, y } = e.target?.attrs;
        const [snapX, snapY] = snapToGrid(x, y);
    
        const isNearSelectedPoint = (px, py) => (
            px <= selectedIntersectionPoint.x + 5 && px >= selectedIntersectionPoint.x - 5 &&
            py <= selectedIntersectionPoint.y + 5 && py >= selectedIntersectionPoint.y - 5
        );
    
        const updateLines = lines.map((line) => {
            const [x1, y1, x2, y2] = line;
    
            if (isNearSelectedPoint(x1, y1))  return [snapX, snapY, x2, y2];
    
            if (isNearSelectedPoint(x2, y2))  return [x1, y1, snapX, snapY];

            return line;
        });
    
        dispatch(setAfterDelete(updateLines));
        setLineMoving(false);
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
        if (mode !== "Moving") return;
        

        const { x, y } = e.target?.attrs;
        const updatedLines = [...lines];

        const updateLine = (index, startX, startY, endX, endY) => {
            updatedLines[index] = [startX, startY, endX, endY];
        };
       
        const currentLine = updatedLines[selectedLineIndex];
        const [x1, y1, x2, y2] = currentLine;

        if (position === "start") {
            updateLine(selectedLineIndex, x, y, x2, y2);
        } else if (position === "end") {
            updateLine(selectedLineIndex, x1, y1, x, y);
        }

        dispatch(setAfterDelete(updatedLines));
        
    }

    const handleDragEnd = (e, position) => {
        if (mode !== "Moving") return;
        
        const { x, y } = e.target?.attrs;
        const [snapX, snapY] = snapToGrid(x, y);
        const updatedLines = [...lines];
    
        const updateLine = (index, newX1, newY1, newX2, newY2) => {
            updatedLines[index] = [newX1, newY1, newX2, newY2];
        };
    
        const currentLine = updatedLines[selectedLineIndex];
        const [x1, y1, x2, y2] = currentLine;
    
        if (position === "start") {
            updateLine(selectedLineIndex, snapX, snapY, x2, y2);
        } else if (position === "end") {
            updateLine(selectedLineIndex, x1, y1, snapX, snapY);
        }
    
        dispatch(setAfterDelete(updatedLines));
        setSelectedLineIndex(null);
        
    }

   
    /* ----------Line Dragging by Body----------- */
    const handleLineMoveStart = (e) => {
        
        const [x1,y1,x2,y2] = e.target.attrs.points
        setTempLinePoints({x1,y1,x2,y2})
    }


    const handleLineMove = (e) => {
        const { x, y } = e.target?.position();
        const [snapX, snapY] = snapToGrid(x, y);
    
        const isMatchingLine = (line, points) => {
            const [x1, y1, x2, y2] = line;
            const { x1: px1, y1: py1, x2: px2, y2: py2 } = points;
            return (
                (x1 === px1 && y1 === py1 && x2 === px2 && y2 === py2) ||
                (x2 === px1 && y2 === py1 && x1 === px2 && y1 === py2)
            );
        };
    
        const isMatchingPoint = (x, y, points) => {
            const { x1, y1, x2, y2 } = points;
            return (x === x1 && y === y1) || (x === x2 && y === y2);
        };
    
        const updateLines = lines.map(line => {
            const [x1, y1, x2, y2] = line;
    
            if (isMatchingLine(line, tempLinePoints)) {
                return [x1 + snapX, y1 + snapY, x2 + snapX, y2 + snapY];
            }
    
            if (isMatchingPoint(x1, y1, tempLinePoints)) {
                return [x1 + snapX, y1 + snapY, x2, y2];
            }
    
            if (isMatchingPoint(x2, y2, tempLinePoints)) {
                return [x1, y1, x2 + snapX, y2 + snapY];
            }
    
            return line;
        });
    
        e.target.position({ x: 0, y: 0 });
        setTempLinePoints(null);
        dispatch(setAfterDelete(updateLines));
    }

    //Line position solve with https://stackoverflow.com/questions/73631342/konva-line-drag
       

    /* ----------Calculations----------- */

    const calculateStageOffSet = (window) => {
        return (-(window) / 2)
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
            width={window.innerWidth} 
            height={window.innerHeight} 
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            ref={stageRef}
            draggable={mode === "Moving" ? true : false}
            offsetX={calculateStageOffSet(windowWidth)}
            offsetY={calculateStageOffSet(windowHeight)}
        >
            <Layer
                listening={false}
            >
                {/* ------------Default Grid and center drawing---------------- */}
                {lines && drawGrid()}
        
                <Circle x={0} y={0} radius={5} fill="red"/>
                {/* ------------Default Grid and center drawing---------------- */}
            </Layer>

            <Layer >

                {/* ------------Line drawing---------------- */}
                {lines.map((line, index) => (
                    <>
                        {console.log(lines)}
                        <Line
                            key={index}
                            points={line}
                            stroke="blue"
                            strokeWidth={5}
                            onClick={() => handleDeleteLine(index)}
                            draggable={mode === "Moving" ? true : false}
                            onDragStart={handleLineMoveStart}
                            onDragEnd={e => handleLineMove(e,index)}
                            hitStrokeWidth={10}
                            perfectDrawEnabled={false}
                        />
                        <Circle 
                            key={`${index}-start`} 
                            x={line[0]} 
                            y={line[1]} 
                            radius={5} 
                            fill="black"
                            onDragStart={() => handleDragStart(index)}
                            onDragMove={(e) => handleOnDrag(e,"start") }
                            onDragEnd={(e) => handleDragEnd(e,"start")}
                            draggable={mode === "Moving" ? true : false} 
                            perfectDrawEnabled={false}   
                        />
                        <Circle 
                            key={`${index}-end`} 
                            x={line[2]} 
                            y={line[3]} 
                            radius={5} 
                            fill="black"
                            onDragStart={() => handleDragStart(index)}
                            onDragMove={(e) => handleOnDrag(e,"end") }
                            onDragEnd={(e) => handleDragEnd(e,"end")}
                            draggable={mode === "Moving" ? true : false}
                            perfectDrawEnabled={false}
                            
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
                    <>
                        <Line points={tempLine} stroke="red" strokeWidth={5} key={uuidv4()} />
                        {drawDimensionLine(tempLine, 'tempLine-dimension')}
                        {/* {lines.length > 0 && drawAngle(lines[lines.length - 1], tempLine)} */}
                    </>
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