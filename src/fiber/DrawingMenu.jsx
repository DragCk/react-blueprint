import { Hud, OrthographicCamera, Html } from "@react-three/drei"
import { useRef} from "react"


const DrawingMenu = () =>  {
    return (
        <Hud>
            <OrthographicCamera makeDefault position={[0, 0, 2]} zoom={50} />
            
            <Button id={0} position={[-6, -6, 0]} />
            <Button id={1} position={[-3, -6, 0]} />
            <Button id={2} position={[-0, -6, 0]} />
            <Button id={3} position={[3, -6, 0]} />
            <Button id={4} position={[6, -6, 0]} />
        </Hud>
    )
}


function Button({ id, position}) {
    const ref = useRef()
    
    return (
        <Html>
            <mesh ref={ref} position={position} >
                <sphereGeometry />
                <meshBasicMaterial color="red" />
            </mesh>
            
        </Html>
    )
}

export default DrawingMenu