/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
/* eslint-disable react/no-unknown-property */
import {Suspense, useEffect, useRef, useState} from "react"
import { CameraControls, OrbitControls, Environment, MeshReflectorMaterial, useTexture, PivotControls } from "@react-three/drei"
import { Canvas } from "@react-three/fiber"
import Floor from "./components/Floor"
import Walls from "./components/Walls"
import Walls2 from "./components/Walls2"

import Cabinet from "./models/Cabinet"
import LoadModel from "./models/LoadModel"
import Camera from "./components/Camera"

import * as THREE from "three"


const ThreeDrawing = ({lines, models}) => {

    console.log("thist is three")
    console.log(lines)
  
    console.log("Models")
    console.log(models)

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

    /*--------Find center of scene--------*/
    const findCenterOfScene = (points) => {
        if (points.length === 0) return { x: 0, y: 0 };

        // 初始化總和
        let sumX = 0;
        let sumY = 0;

        // 將所有點的座標加總
        for (let i = 0; i < points.length; i++) {
            sumX += points[i].x;
            sumY += points[i].y;
        }

        // 計算平均值
        const centerX = sumX / points.length;
        const centerY = sumY / points.length;

        return { x: centerX, y: centerY };
    }

    const center = findCenterOfScene(intersection)
    
    const originPositionX = center.x ? center.x : lines[0][0]
    const originPositionZ = center.y ? center.y : lines[0][1]
    
   

    return (
        <>
          <Canvas
              camera={{
                  fav:45,
                  near:0.1,
                  far: 3000,
                  position:[0, 25, -10], 
              }}
          >

            {/* <OrbitControls makeDefault enableDamping /> */}

            <Camera/>

            <directionalLight position={ [ 0, 20, 0 ] } intensity={ 1 } />
            <ambientLight intensity={ 0.5 } />
            

            <Environment preset="city" />
            
            {/* <group >
                {lines.map((line, index) => {
                    return (
                        <Walls line={line} key={index} originPositionX={originPositionX} originPositionZ={originPositionZ} />
                    )
                })}
            </group> */}
            
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
            
            
            <Suspense>
              {models && models.map((model) => {
                return (
                  <LoadModel url={model.file} key={model.id} />
                )
              })}     
            </Suspense>
          
          </Canvas>
        </>

    ) 
}

export default ThreeDrawing