/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
/* eslint-disable react/no-unknown-property */

import { OrbitControls, Edges, Environment, MeshReflectorMaterial, useTexture } from "@react-three/drei"
import { Canvas } from "@react-three/fiber"
import Floor from "./components/Floor"
import Walls from "./components/Walls"
import Walls2 from "./components/Walls2"

import * as THREE from "three"


const ThreeDrawing = ({lines}) => {
   
    const originPositionX = lines[0][0]
    const originPositionZ = lines[0][1]
    console.log("thist is three")
    console.log(lines)

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
    console.log(intersection)


    return (
        <>
            <Canvas
                raycaster={{ 
                params:{ 
                    Line:{ 
                        threshold: 5 
                }}}}
                camera={{
                    fav:45,
                    near:0.1,
                    far: 3000,
                    position:[1, 30, -1],
                }}
            >
          
        

            <OrbitControls makeDefault enableDamping />

            <directionalLight position={ [ 1, 2, 3 ] } intensity={ 4.5 } />
            <ambientLight intensity={ 1.5 } />
            
            <Environment preset="city" background/>
            
            <Floor/>
            
            <group >
                {lines.map((line, index) => {
                    return (
                        <Walls line={line} key={index} originPositionX={originPositionX} originPositionZ={originPositionZ} />
                    )
                })}
            </group>
           
           
            </Canvas>
        </>

    ) 
}

export default ThreeDrawing