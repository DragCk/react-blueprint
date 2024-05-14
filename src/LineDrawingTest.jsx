
import { useMemo, useCallback } from 'react';

import { BlurFilter, TextStyle } from 'pixi.js';
import { Stage, Container, Sprite, Text, Graphics } from '@pixi/react';

const App = () => {

    const draw = useCallback((g) => {
        g.clear();
       
        g.lineStyle(4, 0xffd900, 1);
        g.moveTo(50, 50);
        g.lineTo(250, 50);
        g.lineTo(100, 100);
        g.closePath()
       
      }, []);


    const handleMouseDown = (e) => {
        console.log(e)
    }

  return (
    <Stage 
        width={window.innerWidth} 
        height={window.innerHeight} 
        options={{ background: 0x1099bb }}
        onPointerDown={handleMouseDown}
        
    >
      <Graphics draw={draw} anchor={[200,200]} />
    </Stage>
  );
};

export default App