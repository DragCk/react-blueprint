import { MeshReflectorMaterial, useTexture } from "@react-three/drei"


const Floor = () => {

    const floorTexture = useTexture({
        map: "./textures/raw_plank_wall_diff_1k.jpg",
        aoMap: "./textures/raw_plank_wall_arm_1k.jpg",
        displacementmap:"./textures/raw_plank_wall_disp_1k.jpg",
        normalMap: "./textures/raw_plank_wall_nor_gl_1k.jpg"

    })

    return (
        <mesh rotation-x={-Math.PI * 0.5} position={[0, -2, 0]} scale={1.5} >
                <planeGeometry args={[1000, 1000]} />
                <MeshReflectorMaterial
                    {...floorTexture}
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
                    reflectorOffset={0.8} // Offsets the virtual camera that projects the reflection. Useful when the reflective surface is some distance from the object's origin (default = 0)
                />
        
            </mesh>
    )

}

export default Floor