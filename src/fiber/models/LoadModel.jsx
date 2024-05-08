/* eslint-disable react/no-unknown-property */
/* eslint-disable react/prop-types */
import { useTexture, useGLTF, PivotControls, Html } from "@react-three/drei";
import { applyProps } from "@react-three/fiber";
import { useState, useEffect, useMemo } from "react";

const LoadModel = ({model}) => {
    
    const gltf = useGLTF(model.path)
    const copiedScene = useMemo(() => gltf.scene.clone(), [gltf.scene])
    const [Clicked, setClicked] = useState(false)

    const handleOnClick = (e) => {
        e.stopPropagation()
        setClicked(!Clicked)
    }

    const textures = model.texture ? model.texture.map((tex) => useTexture(tex)) : null

    console.log("this is textures")
    console.log(textures)

    useEffect(() => {
        copiedScene.traverse((o)=> {
            if(o.isMesh){
                applyProps(o, {
                    castShadow: true, 
                    receiveShadow: true,
                    'material-envMapIntensity': 0.5,
                    'material-roughness': 0.5,
                    'material-displacementScale': 0,
                    'material-metalness' : 0,
                })
            }})                  
    }, [copiedScene])

    return (
        <>
            <PivotControls
                anchor={[0, 0, 0]}
                scale={model.scale}
                depthTest={false}
                activeAxes={[true,false,true]}
                disableScaling
                disableAxes={Clicked ? false : true}
                disableRotations={Clicked ? false : true}
                disableSliders={Clicked ? false : true}
                >
                    {Clicked && 
                        (
                            <Html position={[0,5,0]}  occlude rotation-y={Math.PI}>
                                <p>{`${model.name}`}</p>
                            </Html>
                        )
                    }
                    <primitive object={copiedScene} scale={model.scale} rotation-y={Math.PI} onClick={(e) => handleOnClick(e)} />
            </PivotControls>
          
        </>
    )

}

export default LoadModel