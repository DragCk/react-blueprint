/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/no-unknown-property */
import { useEffect } from 'react'
import { useGLTF, useTexture } from '@react-three/drei'
import { applyProps } from '@react-three/fiber'

useGLTF.preload("./cabinet/cabinet.glb")

const Cabinet = (props) => {

    const {nodes, scene} = useGLTF("./cabinet/cabinet.glb")
    const texture = useTexture({
        material_1_base: "./cabinet/1/tu_BaseColor.png",
        material_1_normal: "./cabinet/1/tu_Normal.png",
        material_1_roughness: "./cabinet/1/tu_Roughness.png",
        material_1_metalness: "./cabinet/1/tu_Metallic.png",
        material_1_displacement: "./cabinet/1/tu_Displacement.png",
    })

    texture.material_1_base.flipY = false
    texture.material_1_roughness.flipY = false
    texture.material_1_normal.flipY = false
    texture.material_1_metalness.flipY = false
    

    

    useEffect(() => {
        scene.traverse((o)=> {
            if(o.isMesh){
                applyProps(o, {
                    castShadow: true, 
                    receiveShadow: true,
                    'material-envMapIntensity': 0.5,
                    'material-roughness': 0.5,
                    'material-displacementScale': 0,
                    'material-metalness' : 0,
                })
                
            o.material.map = texture.material_1_base
            o.material.normalMap = texture.material_1_normal
            o.material.metalnessMap = texture.material_1_metalness
            o.material.displacementMap = texture.material_1_displacement
            o.material.roughnessMap = texture.material_1_roughness
        
                
            }})
    }, [scene])

   

  return (

    
    //<primitive object={model.scene} {...props}/>

    <group {...props} dispose={null} scale={2.5}>
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.tudaugiuong.geometry}
        material={nodes.tudaugiuong.material}
        >
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Cube001.geometry}
          material={nodes.Cube001.material}
          position={[0, 0, 0.09]}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Cube003.geometry}
          material={nodes.Cube003.material}
          position={[0, 0, 0.19]}
        />

      </mesh>
    </group>
    
  )
}

export default Cabinet