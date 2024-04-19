import { useState } from 'react';
import { Line } from '@react-three/drei';

function PolyLine({ defaultStart, defaultEnd }) {
    const [start, setStart] = useState(defaultStart)
    const [end, setEnd] = useState(defaultEnd)
    const [hovered, setHover] = useState(false)

    return (
      <>
        {console.log(start, end)}
        <Line 
          points={[...start, ...end]} 
          lineWidth={5} 
          color={hovered? "red":"blue"} 
          onPointerOver={() => setHover(true)}
          onPointerOut={() => setHover(false)}
        />
        <EndPoint position={start} onDrag={setStart} />
        <EndPoint position={end} onDrag={setEnd} />
      </>
    )
}

function EndPoint({ position, onDrag }) {
    const [active, setActive] = useState(false)
    const [hovered, setHover] = useState(false)
    const down = (event) => {
      event.stopPropagation()
      event.target.setPointerCapture(event.pointerId)
      setActive(true)
    }
    const up = () => {
      setActive(false)
    }
    const move = (event) => {
      
      if (active && onDrag) 
        onDrag([
            Math.round(event.unprojectedPoint.x / 20) * 20, 
            Math.round(event.unprojectedPoint.y / 20) * 20,
            1
        ])
    }
    return (
      <mesh
        position={position}
        onPointerOver={() => setHover(true)}
        onPointerOut={() => setHover(false)}
        onPointerDown={down}
        onLostPointerCapture={up}
        onPointerUp={up}
        onPointerMove={move}>
        <sphereGeometry args={[10, 16, 16]} />
        <meshBasicMaterial color={hovered ? 'hotpink' : 'orange'} />
      </mesh>
    )
}

export default PolyLine;
