import { CameraControls } from "@react-three/drei"
import { useEffect, useRef } from "react"

const Camera = () => {
    const cameraControlsRef = useRef()

    useEffect(() => {
        cameraControlsRef.current?.setLookAt(0,25,-10,0,3,0,true)
    },[])

    return (
        <>
            <CameraControls
                makeDefault
                maxPolarAngle={Math.PI * 0.5} 
                polarRotateSpeed={0.5}
                azimuthRotateSpeed={0.5}
                dollySpeed={0.5}
                truckSpeed={0.5}
                ref={cameraControlsRef}
            />
        </>
    )

}


export default Camera