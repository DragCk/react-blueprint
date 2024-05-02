/* eslint-disable react/no-unknown-property */
import { useEffect, useState } from 'react'
import { useGLTF, useTexture, Outlines } from '@react-three/drei'
import { useControls } from "leva"
import { applyProps } from '@react-three/fiber'


const Cabinet = (props) => {

    const [hover, setHover] = useState(false)

    const {nodes, materials, scene} = useGLTF("./cabinet/cabinet.glb")
    const texture = useTexture({
        material_1_base: "./cabinet/1/tu_BaseColor.png",
        material_1_normal: "./cabinet/1/tu_Normal.png",
        material_1_roughness: "./cabinet/1/tu_Roughness.png",
        material_1_metalness: "./cabinet/1/tu_Metallic.png",
        material_1_displacement: "./cabinet/1/tu_Displacement.png",
        material_2_base: "./cabinet/2/tu_BaseColor.png",
        material_2_normal: "./cabinet/2/tu_Normal.png",
        material_2_roughness: "./cabinet/2/tu_Roughness.png",
        material_2_metalness: "./cabinet/2/tu_Metallic.png",
        material_2_displacement: "./cabinet/2/tu_Displacement.png",
        material_3_base: "./cabinet/3/tu_BaseColor.png",
        material_3_normal: "./cabinet/3/tu_Normal.png",
        material_3_roughness: "./cabinet/3/tu_Roughness.png",
        material_3_metalness: "./cabinet/3/tu_Metallic.png",
        material_3_displacement: "./cabinet/3/tu_Displacement.png",
    })

    texture.material_1_base.flipY = false
    texture.material_1_roughness.flipY = false
    texture.material_1_normal.flipY = false
    texture.material_1_metalness.flipY = false
    
    texture.material_2_base.flipY = false
    texture.material_2_roughness.flipY = false
    texture.material_2_normal.flipY = false


    texture.material_3_base.flipY = false
    texture.material_3_roughness.flipY = false
    texture.material_3_normal.flipY = false

    const cabinetControls= useControls('Cabinet',{
        cTexture:{options:["material_1", "material_2", "material_3"]},
        envIntansity:{value:0.5, min:0, max:1},
        roughness:{value:1, min:0, max:1},

        //metalness:false
    })

    

    useEffect(() => {
        console.log(nodes)
        console.log(materials)
        scene.traverse((o)=> {
            if(o.isMesh){
                applyProps(o, {
                    castShadow: true, 
                    receiveShadow: true,
                    'material-envMapIntensity':cabinetControls.envIntansity,
                    'material-roughness': cabinetControls.roughness,
                    'material-displacementScale': 0,
                    'material-metalness' : 0,
                })
                if(cabinetControls.cTexture === "material_1"){
                    o.material.map = texture.material_1_base
                    o.material.normalMap = texture.material_1_normal
                    o.material.metalnessMap = texture.material_1_metalness
                    o.material.displacementMap = texture.material_1_displacement
                    o.material.roughnessMap = texture.material_1_roughness
                }
                if(cabinetControls.cTexture === "material_2"){
                    o.material.map = texture.material_2_base
                    o.material.normalMap = texture.material_2_normal
                    o.material.metalnessMap = texture.material_2_metalness
                    o.material.displacementMap = texture.material_2_displacement
                    o.material.roughnessMap = texture.material_2_roughness
                }
                if(cabinetControls.cTexture === "material_3"){
                    o.material.map = texture.material_3_base
                    o.material.normalMap = texture.material_3_normal
                    o.material.metalnessMap = texture.material_3_metalness
                    o.material.displacementMap = texture.material_3_displacement
                    o.material.roughnessMap = texture.material_3_roughness
                }
    
                
            }
            })
    }, [scene,cabinetControls])

   

  return (

    
    //<primitive object={model.scene} {...props}/>

    <group {...props} dispose={null} scale={1}>
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.tudaugiuong.geometry}
        material={nodes.tudaugiuong.material}
        onPointerEnter={() => {setHover(!hover)}}
        onPointerLeave={() => {setHover(!hover)}}
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
        {hover && <Outlines color="white" thickness={0.02} />}
      </mesh>
      
    </group>
    
  )
}

export default Cabinet