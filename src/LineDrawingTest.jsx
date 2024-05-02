import {useState} from "react"
import { Stage, Layer, Circle, Text, Label, Tag  } from "react-konva";

export default function App() {

    const [position, setPosition] = useState({x:100, y:100})

    const handleDragStart = e => {
        e.target.setAttrs({
            shadowOffset: {
            x: 15,
            y: 15
            },
            scaleX: 1.1,
            scaleY: 1.1
        });
    };

    const handleDragMove = e => {
        setPosition({x:e.target.attrs.x, y:e.target.attrs.y})
    }

    const handleDragEnd = e => {
        console.log(position)
        e.target.to({
            duration: 0.5,
            easing: Konva.Easings.ElasticEaseOut,
            scaleX: 1,
            scaleY: 1,
            shadowOffsetX: 5,
            shadowOffsetY: 5
        });
    };



  return (
    <Stage 
        width={window.innerWidth}
        height={window.innerHeight}>
        <Layer>
            <Label x={200} y={200} >
                <Tag 
                    fill="white" 
                    pointerWidth={10} 
                    pointerHeight={10} 
                    lineJoin="round" 
                    shadowColor="white"/>
                <Text 
                    text={`x:${position.x},y:${position.y}`} 
                    padding={5} 
                    fill="black"/>
            </Label> 
            <Circle
                x={position.x}
                y={position.y}
                width={100}
                height={100}
                fill="red"
                shadowBlur={5}
                draggable
                onDragStart={handleDragStart}
                onDragMove={handleDragMove}
                onDragEnd={handleDragEnd}/>
        </Layer>
    </Stage>
  );
}