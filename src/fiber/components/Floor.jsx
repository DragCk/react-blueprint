/* eslint-disable react/no-unknown-property */
import { MeshReflectorMaterial, useTexture } from "@react-three/drei"


const Floor = () => {

    const floorTexture = useTexture({
        map: "./textures/raw_plank_wall_diff_1k.jpg",
        aoMap: "./textures/raw_plank_wall_arm_1k.jpg",
        displacementmap:"./textures/raw_plank_wall_disp_1k.jpg",
        normalMap: "./textures/raw_plank_wall_nor_gl_1k.jpg"

    })

    return (
        <mesh rotation-x={-Math.PI * 0.5} position={[0, -0.1 , 0]} scale={1.5} >
                <planeGeometry args={[100, 100]} />
                <MeshReflectorMaterial
                    {...floorTexture}
                    blur={[300, 100]}
                    resolution={512}
                    mixBlur={1}
                    mixStrength={80}
                    roughness={1}
                    depthScale={1.2}
                    minDepthThreshold={0.4}
                    maxDepthThreshold={1.4}
                    color="#050505"
                    metalness={0.5} />
        
            </mesh>
    )

}

export default Floor