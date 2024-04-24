/* eslint-disable react/no-unknown-property */
/* eslint-disable react/prop-types */

// eslint-disable-next-line no-unused-vars
import { Edges, useTexture} from "@react-three/drei"
import * as THREE from "three"

// eslint-disable-next-line no-unused-vars
const Walls2 = ({line, key, originPositionX, originPositionZ}) => {
    const floorTexture = useTexture({
        map: "./textures/raw_plank_wall_diff_1k.jpg",
        aoMap: "./textures/raw_plank_wall_arm_1k.jpg",
        displacementmap:"./textures/raw_plank_wall_disp_1k.jpg",
        normalMap: "./textures/raw_plank_wall_nor_gl_1k.jpg"
    })

    const wallHeight = 100

    // eslint-disable-next-line no-unused-vars
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

    const shape = new THREE.Shape()
    shape.moveTo(0, 0)
    shape.lineTo(10, 0)
    shape.lineTo(10,10)
    shape.lineTo(0,10)
    shape.lineTo(0, 0)

    const extrudeSettings = {
        steps: 50,
        depth: 2,
        bevelEnabled: false,
       
    }

    return (
        <>
        <mesh key={key} >                          
            <extrudeGeometry args={[shape, extrudeSettings]} />
            <meshStandardMaterial
                {...floorTexture}
                side={THREE.DoubleSide}
            />
        </mesh>
        </>
    )
}

export default Walls2