/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
/* eslint-disable react/no-unknown-property */
import { Suspense } from "react"
import { Environment } from "@react-three/drei"
import { Canvas } from "@react-three/fiber"
import { useSelector } from "react-redux"

import Floor from "./components/Floor"
import Walls from "./components/Walls"
import Walls2 from "./components/Walls2"

import LoadModel from "./models/LoadModel"
import Camera from "./components/Camera"

import * as THREE from "three"

const ThreeDrawing = ({models}) => { 
    const {lines} = useSelector((state) => state.lines)

    /*--------Find Closed Shapes--------*/
    function findClosedShapes(coordinates) {
      const adjacencyList = new Map();
    
      // Create adjacency list
      coordinates.forEach(([x1, y1, x2, y2]) => {
        if (!adjacencyList.has(`${x1},${y1}`)) {
          adjacencyList.set(`${x1},${y1}`, []);
        }
        if (!adjacencyList.has(`${x2},${y2}`)) {
          adjacencyList.set(`${x2},${y2}`, []);
        }
        adjacencyList.get(`${x1},${y1}`).push(`${x2},${y2}`);
        adjacencyList.get(`${x2},${y2}`).push(`${x1},${y1}`);
      });
    
      const closedShapes = [];
    
      // DFS to traverse the graph
      function dfs(node, visited, shape, initialNode) {
        visited.add(node);
        shape.push(node.split(","));
        adjacencyList.get(node).forEach(neighbor => {
          if (!visited.has(neighbor)) {
            dfs(neighbor, visited, shape, initialNode);
          } else if (neighbor === initialNode && shape.length > 2) {
            closedShapes.push(shape.slice());
          }
        });
      }
    
      const visited = new Set();
      adjacencyList.forEach((_, node) => {
        if (!visited.has(node)) {
          const shape = [];
          dfs(node, visited, shape, node);
        }
      });
    
      return closedShapes;
    }
      
    const closedShapes = findClosedShapes(lines);
    // console.log("形成閉合圖形的座標:", closedShapes);


    /*--------Find Intersections--------*/
    const findIntersections = () => {
        const intersections = [];

        lines.forEach((line1, i) => {
            const [x1, y1, x2, y2] = line1;
    
            for (let j = i + 1; j < lines.length; j++) {
                const [x3, y3, x4, y4] = lines[j];
    
                const denominator = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);
                if (denominator === 0) continue;
    
                const t = ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) / denominator;
                const u = -((x1 - x2) * (y1 - y3) - (y1 - y2) * (x1 - x3)) / denominator;
    
                if (t >= 0 && t <= 1 && u >= 0 && u <= 1) {
                    const intersectionX = x1 + t * (x2 - x1);
                    const intersectionY = y1 + t * (y2 - y1);
                    const intersectionPoint = { x: intersectionX, y: intersectionY };
    
                    if (!intersections.some(point => Math.abs(point.x - intersectionX) < Number.EPSILON && Math.abs(point.y - intersectionY) < Number.EPSILON)) {
                        intersections.push(intersectionPoint);
                    }
                }
            }
        });
    
        return intersections;
    };

    const intersection = findIntersections()

    /*--------Find center of scene--------*/
    const findCenterOfScene = (points) => {
        if (points.length === 0) return [0, 0];

        let sumX = 0;
        let sumY = 0;

        for (let i = 0; i < points.length; i++) {
            sumX += points[i].x;
            sumY += points[i].y;
        }

        const centerX = sumX / points.length;
        const centerY = sumY / points.length;

        return [centerX, centerY];
    }

    const [centerX, centerY] = findCenterOfScene(intersection)
    
    const originPositionX = centerX ? centerX : 0
    const originPositionZ = centerY ? centerY : 0
    
   

    return (
        <>
          
          <Canvas
              camera={{
                  fav:45,
                  near:0.1,
                  far: 3000,
                  position:[0, 25, -10], 
              }}
              shadows
          >
            
            <Camera/>

            <directionalLight 
              position={ [ 0, 20, 0 ] } 
              intensity={ 3 } 
              castShadow 
              shadow-camera-near = {1}
              shadow-camera-far={1000} 
            />

            <Environment preset="city" />
            
            <group rotation-x={Math.PI * 0.5}>
                {lines.map((line, index) => {
                    return (
                        <Walls2 line={line} key={index} originPositionX={originPositionX} originPositionZ={originPositionZ}/>
                    )
                })}
                {closedShapes && closedShapes.map((closeShape, index) => {
                    return(
                        <Floor closeShape={closeShape} key={index} originPositionX={originPositionX} originPositionZ={originPositionZ} />
                    )
                })}
            </group>
            
            {/* <mesh position={[0, 5 ,0]} castShadow>
              <sphereGeometry args={[2,20,10]}  />
              <meshStandardMaterial color="red" castShadow/>
            </mesh> */}
              
            

            <Suspense>
              {models && models.map((model, index) => {
                return (
                  <LoadModel key={index} model={model} />
                )
              })}     
            </Suspense>
          
          </Canvas>
        </>

    ) 
}

export default ThreeDrawing