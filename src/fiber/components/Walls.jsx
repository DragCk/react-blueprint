/* eslint-disable no-unused-vars */
/* eslint-disable react/no-unknown-property */
/* eslint-disable react/prop-types */

import { Edges, useTexture } from "@react-three/drei"
import * as THREE from "three"

const Walls = ({line, originPositionX, originPositionZ}) => {
    const wallTexture = useTexture({
        map: "./wallTexture/medieval_red_brick_diff_1k.jpg",
        aoMap: "./wallTexture/medieval_red_brick_arm_1k.jpg",
        displacementmap:"./wallTexture/medieval_red_brick_disp_1k.jpg",
        normalMap: "./wallTexture/medieval_red_brick_nor_gl_1k.jpg"
    })


    const wallHeight = 10

    function getVertices (line) {
    
        const vertices = new Float32Array( [
          (originPositionX-line[0])/10, 0, (originPositionZ- line[1])/10 ,
          (originPositionX-line[0])/10, wallHeight, (originPositionZ - line[1])/10,
          (originPositionX-line[2])/10, wallHeight, (originPositionZ - line[3])/10 ,
        
          (originPositionX-line[0])/10, 0, (originPositionZ- line[1])/10 ,
          (originPositionX-line[2])/10, wallHeight, (originPositionZ- line[3])/10 ,
          (originPositionX-line[2])/10, 0, (originPositionZ- line[3])/10 ,
        ]);
        
        return vertices
    }

    

    return (

        <mesh >                          
            <bufferGeometry attach="geometry">
                <bufferAttribute attach="attributes-position" array={getVertices(line)}  itemSize={3} count={6} />
            </bufferGeometry>
            <meshStandardMaterial 
                color="#eab676"
                attach="material"
                // {...wallTexture}
                side={THREE.DoubleSide}
                
            />
            <Edges
                linewidth={5}
                scale={1}
                threshold={15} // Display edges only when the angle between two faces exceeds this value (default=15 degrees)
                color="white"
            />
        </mesh>
    )
}

export default Walls