/* eslint-disable react/no-unknown-property */
/* eslint-disable react/prop-types */
// eslint-disable-next-line no-unused-vars
import { Edges, useTexture} from "@react-three/drei"
import * as THREE from "three"

const Walls2 = ({line, index, originPositionX, originPositionZ}) => {
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
    shape.moveTo((originPositionX - line[0])/10, (originPositionZ -line[1])/10)
    shape.lineTo((originPositionX - line[2])/10, (originPositionZ -line[3]) /10)
    
 

    const extrudeSettings = {
        steps: 20,
        depth: 7,
        bevelEnabled: false,
    }


    return (
        <>
            <mesh key={index} position-z={-7} >                          
                <extrudeGeometry args={[shape, extrudeSettings]} />
                <meshBasicMaterial
                    color="lightgray"
                    side={THREE.BackSide}
                />
                <Edges
                linewidth={5}
                scale={1}
                threshold={15} // Display edges only when the angle between two faces exceeds this value (default=15 degrees)
                color="white"
            />
            </mesh>
        </>
    )
}

export default Walls2