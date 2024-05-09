/* eslint-disable react/no-unknown-property */
/* eslint-disable react/prop-types */
import { useTexture, useGLTF, PivotControls, Html } from "@react-three/drei";
import { applyProps } from "@react-three/fiber";
import { useState, useEffect, useMemo } from "react";
import { Box, Button, Typography, Container } from "@mui/material";

const LoadModel = ({model}) => {
    
    const gltf = useGLTF(model.path)
    const copiedScene = useMemo(() => gltf.scene.clone(), [gltf.scene])
    const [Clicked, setClicked] = useState(false)

    const handleOnClick = (e) => {
        e.stopPropagation()
        setClicked(!Clicked)
    }

    /* -------------Textures setup-------------- */
    const textures = model.texture ? model.texture.map((tex) => useTexture(tex)) : []
    
   
    textures.map((tex)=> {
        tex.map.flipY = false
        model.textureRepeat ? tex.map.repeat.x = -1 : null
        tex.normalMap ? tex.normalMap.flipY = false : null
        tex.roughnessMap ? tex.roughnessMap.flipY = false : null
    })
    

    /* -------------Change texture-------------- */

    const handleChangeTexture = (texture) => {
        console.log("Hi I'm Here")
        console.log(texture)
        
        copiedScene.traverse((o) => {
            if(o.isMesh){
                o.material.map = texture.map || null
                o.material.normalMap = texture.normalMap || null
                o.material.metalnessMap = texture.metalnessMap || null
                o.material.displacementMap = texture.displacementMap || null
                o.material.roughnessMap = texture.roughnessMap || null
            }
        })
        
        
    }

    /* -------------Model setup-------------- */

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
                if(model.texture){
                    console.log("")
                    o.material.map = textures[0].map || null
                    o.material.normalMap = textures[0].normalMap || null
                    o.material.metalnessMap = textures[0].metalnessMap || null
                    o.material.displacementMap = textures[0].displacementMap || null
                    o.material.roughnessMap = textures[0].roughnessMap || null
                }
            }
            
        })                  
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
                                <Box 
                                    border="1px solid blue" 
                                    bgcolor="white" 
                                    borderRadius="10px" 
                                >
                                    <Container>
                                        <Typography align="center" >{`${model.name}`}</Typography>
                                    </Container>
                                    
                                    {model.texture ?
                                    (  
                                        <Container>
                                           {textures.map((texture,index)=> {
                                                return (<Button onClick={() => {handleChangeTexture(texture)}} >{`${index}`}</Button>)
                                            })}
                                        </Container>
                                    ) 
                                    : null}
                                </Box>
                            </Html>
                        )
                    }
                    <primitive object={copiedScene} scale={model.scale} rotation-y={Math.PI} onClick={(e) => handleOnClick(e)} />
            </PivotControls>
          
        </>
    )

}

export default LoadModel