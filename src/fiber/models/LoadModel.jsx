/* eslint-disable react/no-unknown-property */
/* eslint-disable react/prop-types */
import { useGLTF, PivotControls } from "@react-three/drei";
import { applyProps } from "@react-three/fiber";
import { useState, useEffect, useMemo } from "react";

const LoadModel = (props) => {
    const model = useGLTF(props.url)
    const copiedScene = useMemo(() => model.scene.clone(), [model.scene])
    const [Clicked, setClicked] = useState(false)

    const handleOnClick = (e) => {
        e.stopPropagation()
        setClicked(!Clicked)
    }

    useEffect(() => {
        model.scene.traverse((o)=> {
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
    }, [model.scene])

    console.log(model)


    return (
        <>
            <PivotControls
                anchor={[0, 0, 0]}
                scale={2}
                depthTest={false}
                activeAxes={[true,false,true]}
                disableScaling
                disableAxes={Clicked ? false : true}
                disableRotations={Clicked ? false : true}
                disableSliders={Clicked ? false : true}
                >
                    <primitive object={copiedScene} scale={3} rotation-y={Math.PI} onClick={(e) => handleOnClick(e)} />
            </PivotControls>
          
        </>
    )

}

export default LoadModel