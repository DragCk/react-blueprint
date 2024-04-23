/* eslint-disable react/prop-types */
/* eslint-disable react/no-unknown-property */

import { OrbitControls, Edges, Environment, MeshReflectorMaterial, useTexture } from "@react-three/drei"
import { Canvas } from "@react-three/fiber"
import Floor from "./components/Floor"
import Walls from "./components/Walls"

import * as THREE from "three"


const ThreeDrawing = ({lines}) => {
   
    const originPositionX = lines[0][0]
    const originPositionZ = lines[0][1]
    console.log("thist is three")
    console.log(lines)



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
                    position:[-100, 300, -100],
                }}
            >
          
        

            <OrbitControls makeDefault enableDamping />

            <directionalLight position={ [ 1, 2, 3 ] } intensity={ 4.5 } />
            <ambientLight intensity={ 1.5 } />
            
            <Environment preset="city" background/>
            
            <Floor/>

            {lines.map((line, index) => {
                return (
                    <Walls line={line} key={index} originPositionX={originPositionX} originPositionZ={originPositionZ} />
                )
            })}
            

            </Canvas>
        </>

    ) 
}

export default ThreeDrawing