import { Stage, Layer, Line, Circle} from 'react-konva';
import Grid from './Grid';
import { useState, useEffect } from "react"

const EngineeringDrawing = () => {
    const [lines, setLines] = useState([]);
    const [isDrawing, setIsDrawing] = useState(false);
    const [startPoint, setStartPoint] = useState({ x: 0, y: 0 });
    const [endPoint, setEndPoint] = useState({ x: 0, y: 0 });
   
    const gridSize = 20


    // 設置視窗的中心點為網格的中心點
    const [windowSize, setWindowSize] = useState({ width: window.innerWidth, height: window.innerHeight });
        
    useEffect(() => {
        const handleResize = () => {
        setWindowSize({ width: window.innerWidth, height: window.innerHeight });
        };

        window.addEventListener('resize', handleResize);

        return () => {
        window.removeEventListener('resize', handleResize);
        };
    }, []);

    const snapToGrid = (pos) => {
        // 將位置限制在最接近的網格交叉點上
        return {
          x: Math.round(pos.x / gridSize) * gridSize,
          y: Math.round(pos.y / gridSize) * gridSize
        };
      };

    const handleMouseDown = (e) => {
        setIsDrawing(true);
        const { x, y } = snapToGrid(e.target.getStage().getPointerPosition());
        setStartPoint({ x, y });
        setEndPoint({ x, y }); // 起點和終點相同
    };

    const handleMouseMove = (e) => {
        if (!isDrawing) return;
        const { x, y } = snapToGrid(e.target.getStage().getPointerPosition());
        setEndPoint({ x, y });
    };

    const handleMouseUp = () => {
        setIsDrawing(false);
        // 在滑鼠放開時，將當前繪製的線段添加到線段列表中
        setLines([...lines, { points: [startPoint.x, startPoint.y, endPoint.x, endPoint.y] }]);
    };

    const getIntersectionPoints = () => {
        const intersectionPoints = [];
      
        lines.forEach((line1, i) => {
          const [x1, y1, x2, y2] = line1.points;
      
          lines.slice(i + 1).forEach((line2) => {
            const [x3, y3, x4, y4] = line2.points;
      
            const denominator = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);
      
            if (denominator === 0) return;
      
            const t = ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) / denominator;
            const u = -((x1 - x2) * (y1 - y3) - (y1 - y2) * (x1 - x3)) / denominator;
      
            if (t >= 0 && t <= 1 && u >= 0 && u <= 1) {
              const intersectionX = x1 + t * (x2 - x1);
              const intersectionY = y1 + t * (y2 - y1);
              const intersectionPoint = { x: intersectionX, y: intersectionY };
      
              // 檢查是否已存在相同的交點，如果不存在則加入 intersectionPoints 中
              if (!intersectionPoints.some((point) => point.x === intersectionX && point.y === intersectionY)) {
                intersectionPoints.push(intersectionPoint);
              }
            }
          });
        });
      
        return intersectionPoints;
      };
    
      const intersectionPoints = getIntersectionPoints();
      console.log("this is intersection points")
      console.log(intersectionPoints)
    

  return (
    <Stage 
        width={window.innerWidth} 
        height={window.innerHeight}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
    >
      <Layer>
        {/* 繪製網格 */}
        <Grid gridSize={gridSize} width={windowSize.width} height={windowSize.height} />
        {/* 在這裡添加其他繪圖元素 */}
        {lines.map((line, i) => (
          <Line key={i} points={line.points} stroke="lightblue" strokeWidth={5} />
        ))}
        {/* 畫當前正在繪製的線段 */}
        {isDrawing && <Line points={[startPoint.x, startPoint.y, endPoint.x, endPoint.y]} stroke="lightblue" strokeWidth={5} />}
        {console.log(lines)}
        {/* Draw intersection points as circles */}
        {intersectionPoints.map((point, i) => (
          <Circle key={i} x={point.x} y={point.y} radius={5} fill="red" />
        ))}
        
      </Layer>
    </Stage>
  );
};

export default EngineeringDrawing;