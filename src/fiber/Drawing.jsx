/* eslint-disable react/no-unknown-property */
import { OrbitControls, Grid } from "@react-three/drei"
import PolyLine from "./PolyLines"
import DrawingMenu from "./DrawingMenu"

const Drawing = () => {
   
    return (
        <>

            <OrbitControls makeDefault enableRotate={false} />

            <directionalLight position={ [ 1, 2, 3 ] } intensity={ 4.5 } />
            <ambientLight intensity={ 1.5 } />
            

            <Grid  
                rotation={[Math.PI / 2, 0, 0]}
                cellSize={200}
                cellThickness={2}
                cellColor="red"
                sectionSize={20}
                sectionThickness={1.5}
                sectionColor="lightgray"
                fadeDistance={10000}
                infiniteGrid
            />



            <mesh>
                <sphereGeometry position={[0, 0, 0]} args={[3, 10, 10]} />
                <meshBasicMaterial color="red" />
            </mesh>

            <DrawingMenu/>
            
            <PolyLine defaultStart={[-100, -100, 1]} defaultEnd={[0, 100, 1]} />
            <PolyLine defaultStart={[0, 100, 1]} defaultEnd={[100, -100, 1]} />
            
        </>

    ) 
}

export default Drawing