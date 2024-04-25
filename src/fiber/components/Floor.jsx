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
        <mesh rotation-x={-Math.PI * 0.5} position={[0, -0.1 , 0]} scale={1} >
                <planeGeometry args={[200, 200]} />
                <MeshReflectorMaterial
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
                    />
        
            </mesh>
    )

}

export default Floor