/* eslint-disable no-unused-vars */
import EngineeringDrawing from "./drawing/Engineering.drawing";
import Drawing from "./fiber/Drawing.jsx";
import FloorPlan from "./drawing/FloorPlan.jsx";
import ThreeDrawing from "./fiber/Three.drawing.jsx";
import { useState } from "react";
import { Button, Box } from "@mui/material";

/*---------Icons Import---------*/
import DeleteIcon from "@mui/icons-material/Delete"
import ClearIcon from "@mui/icons-material/Clear"
import DrawIcon from "@mui/icons-material/Draw"
import ThreeDRotation from '@mui/icons-material/ThreeDRotation';
import MapIcon from '@mui/icons-material/Map.js';


function App() {
  const [page, setPage] = useState("2D");
  const [lines, setLines] = useState([]);
  const [mode, setMode] = useState("Drawing")
  

  const handleOnClick = () => {
    if (page === "2D") setPage("3D");
    else setPage("2D");
  };

  const handleClean = () => {
    setMode("Drawing")
    setLines([]);
  };


  const handleChangeMode = (m) => {
    setMode(m)
    console.log(mode)
  }

  return (
    <>
      <Box
        width= "100vw"
        height="45px"
        position="fixed"
        zIndex={10}
        bgcolor= "white"
        border="2px solid blue"
        borderRadius="10px"
        justifyContent="center"
        alignContent="center"
      >
        {
          <Box
           margin="1rem"
          >
            <Button 
              variant="contained" 
              disabled={lines.length === 0} 
              onClick={handleOnClick} 
              startIcon={page==="2D"? <ThreeDRotation/> : <MapIcon/> }
            >
              {page === "2D" ? "3D View" : "2D View"}
            </Button>
            {page === "2D" ? (
              <>
                <Button variant="contained" disabled={mode === "Drawing"} onClick={() => {handleChangeMode("Drawing")}} startIcon={<DrawIcon/>}>
                  Draw Line
                </Button>
                <Button variant="contained" disabled={mode === "deleting"} onClick={() => {handleChangeMode("deleting")}} startIcon={<DeleteIcon/>}>
                  Delete Line
                </Button>
                <Button variant="contained" disabled={mode === "Moving"} onClick={() => {handleChangeMode("Moving")}} startIcon={<DeleteIcon/>}>
                  Move Line
                </Button>
                <Button variant="contained" onClick={handleClean} startIcon={<ClearIcon/>}>
                  Clean All
                </Button>
              </>
            ) : (
              <>
                
              </>
            )
          
          }
            
          </Box>
        }
      </Box>
      {page === "2D" ? (
        <FloorPlan
          lines={lines}
          setLines={setLines}
          mode={mode}
        />
      ) : (
        <ThreeDrawing lines={lines} />
      )}
    </>
  );
}

export default App;
