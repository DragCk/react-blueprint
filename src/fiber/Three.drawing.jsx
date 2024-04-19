/* eslint-disable react/prop-types */
/* eslint-disable react/no-unknown-property */

import { OrbitControls, Edges, Environment, MeshReflectorMaterial } from "@react-three/drei"
import { Canvas } from "@react-three/fiber"

import * as THREE from "three"


// const lines = [
//     [260, 240, 260, 540],
//     [260, 540, 740, 540],
//     [740, 540, 740, 420],
//     [260, 240, 380, 120],
//     [380, 120, 740, 120],
//     [740, 120, 740, 420],
//     [740, 360, 980, 360],
//     [980, 360, 980, 540],
//     [740, 540, 980, 540],
//     [260, 360, 420, 360],
//     [420, 360, 420, 540],
//     [540, 140, 540, 260],
//     [540, 260, 740, 260],
//     [540, 140, 540, 120],
// ]


const ThreeDrawing = ({lines}) => {
   
   
    const wallHeight = 100
    const originPositionX = lines[0][0]
    const originPositionZ = lines[0][1]
    console.log("thist is three")
    console.log(lines)

    function getVertices (line) {
    
        const vertices = new Float32Array( [
            // Math.abs(originPositionX-line[0]), 0, Math.abs(originPositionZ- line[1]) ,
            // Math.abs(originPositionX-line[0]), wallHeight, Math.abs(originPositionZ - line[1]),
            // Math.abs(originPositionX-line[2]), wallHeight, Math.abs(originPositionZ - line[3]) ,
        
            // Math.abs(originPositionX-line[0]), 0, Math.abs(originPositionZ- line[1]) ,
            // Math.abs(originPositionX-line[2]), wallHeight, Math.abs(originPositionZ- line[3]) ,
            // Math.abs(originPositionX-line[2]), 0, Math.abs(originPositionZ- line[3]) ,
            originPositionX-line[0], 0, originPositionZ- line[1] ,
            originPositionX-line[0], wallHeight, originPositionZ - line[1],
            originPositionX-line[2], wallHeight, originPositionZ - line[3] ,
        
            originPositionX-line[0], 0, originPositionZ- line[1] ,
            originPositionX-line[2], wallHeight, originPositionZ- line[3] ,
            originPositionX-line[2], 0, originPositionZ- line[3] ,
        ]);
        
        return vertices
    }


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
                    position:[-100, 500, -100],
                }}
            >
          
        

            <OrbitControls makeDefault />

            <directionalLight position={ [ 1, 2, 3 ] } intensity={ 4.5 } />
            <ambientLight intensity={ 1.5 } />
            
            <Environment preset="forest" background/>
            
            {/* <gridHelper args={[2000, 2000, 0xff0000, 'teal']} /> */}

            <mesh rotation-x={-Math.PI * 0.5} position={[0, -2, 0]} scale={100} >
                <planeGeometry args={[100, 100]} />
                <MeshReflectorMaterial
                    blur={[0, 0]} // Blur ground reflections (width, height), 0 skips blur
                    mixBlur={0} // How much blur mixes with surface roughness (default = 1)
                    mixStrength={1} // Strength of the reflections
                    mixContrast={1} // Contrast of the reflections
                    resolution={256} // Off-buffer resolution, lower=faster, higher=better quality, slower
                    mirror={0} // Mirror environment, 0 = texture colors, 1 = pick up env colors
                    depthScale={0} // Scale the depth factor (0 = no depth, default = 0)
                    minDepthThreshold={0.9} // Lower edge for the depthTexture interpolation (default = 0)
                    maxDepthThreshold={1} // Upper edge for the depthTexture interpolation (default = 0)
                    depthToBlurRatioBias={0.25} // Adds a bias factor to the depthTexture before calculating the blur amount [blurFactor = blurTexture * (depthTexture + bias)]. It accepts values between 0 and 1, default is 0.25. An amount > 0 of bias makes sure that the blurTexture is not too sharp because of the multiplication with the depthTexture
                    
                    reflectorOffset={0.2} // Offsets the virtual camera that projects the reflection. Useful when the reflective surface is some distance from the object's origin (default = 0)
                />
            </mesh>


            {lines.map((line, index) => {
                return (
                    <mesh key={index}>
                        <bufferGeometry attach="geometry">
                            <bufferAttribute attach="attributes-position" array={getVertices(line)} itemSize={3} count={6} />
                        </bufferGeometry>
                        <meshBasicMaterial attach="material" color="hotpink" side={THREE.DoubleSide}/>
                        <Edges
                            linewidth={5}
                            scale={1}
                            threshold={15} // Display edges only when the angle between two faces exceeds this value (default=15 degrees)
                            color="white"
                        />
                    </mesh>
                )
            })}
            

            </Canvas>
        </>

    ) 
}

export default ThreeDrawing