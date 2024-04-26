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


    floorTexture.map.wrapS = floorTexture.map.wrapT = THREE.RepeatWrapping;
    floorTexture.map.repeat.set( 1 / 10, 1 / 10 );
    floorTexture.map.offset.set( 0,0 );

    


    const shape = new THREE.Shape()
    shape.moveTo(0, 0)
    shape.lineTo(0, 0)
    shape.lineTo(0, 10)
    shape.lineTo(0, 10)
    shape.lineTo(0, 0)

    const extrudeSettings = {
        steps: 50,
        depth: 0.25,
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