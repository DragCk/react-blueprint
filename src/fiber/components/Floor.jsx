/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
/* eslint-disable react/no-unknown-property */
import { MeshReflectorMaterial, useTexture } from "@react-three/drei"
import * as THREE from "three"

const Floor = ({closeShape, originPositionX, originPositionZ}) => {

    const floorTexture = useTexture({
        map: "./textures/raw_plank_wall_diff_1k.jpg",
        aoMap: "./textures/raw_plank_wall_arm_1k.jpg",
        displacementmap:"./textures/raw_plank_wall_disp_1k.jpg",
        normalMap: "./textures/raw_plank_wall_nor_gl_1k.jpg"

    })

    const shape = new THREE.Shape()
    

    shape.moveTo((originPositionX - parseInt(closeShape[0][0])) / 10 , (originPositionZ - parseInt(closeShape[0][1])) / 10 )
    for(let i=1; i < closeShape.length; i++){
        shape.lineTo((originPositionX - parseInt(closeShape[i][0])) / 10 , (originPositionZ - parseInt(closeShape[i][1])) / 10)
    }
 

    const extrudeSettings = {
        steps: 20,
        depth: 0.1,
        bevelEnabled: false,
    }



    return (
        <mesh receiveShadow  >
                <extrudeGeometry args={[shape, extrudeSettings]} />
                {/* <MeshReflectorMaterial
                    {...floorTexture}
                    blur={[50, 50]}
                    resolution={1024}
                    mixBlur={0.5}
                    mixStrength={100}
                    roughness={1}
                    depthScale={1}
                    minDepthThreshold={0.4}
                    maxDepthThreshold={1.4}
                    color="#050505"
                    metalness={0}
                    mirror={1}
                /> */}
                <meshStandardMaterial 
                    receiveShadow
                    
                   {...floorTexture}
                   side={THREE.FrontSide}
                />

            </mesh>
    )

}

export default Floor