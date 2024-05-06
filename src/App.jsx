/* eslint-disable no-unused-vars */
import EngineeringDrawing from "./drawing/Engineering.drawing";
import Drawing from "./fiber/Drawing.jsx";
import FloorPlan from "./drawing/FloorPlan.jsx";
import ThreeDrawing from "./fiber/Three.drawing.jsx";
import { useState } from "react";
import { Button, Box, Select, MenuItem, FormControl, InputLabel } from "@mui/material";

/*---------Icons Import---------*/
import DeleteIcon from "@mui/icons-material/Delete"
import ClearIcon from "@mui/icons-material/Clear"
import DrawIcon from "@mui/icons-material/Draw"
import ThreeDRotation from '@mui/icons-material/ThreeDRotation';
import MapIcon from '@mui/icons-material/Map.js';

function App() {
  const [page, setPage] = useState("2D");
  const [lines, setLines] = useState([
    [300, 300, 300, 500],
    [300, 500, 500, 500],
    [500, 500, 500, 300],
    [500, 300, 300, 300]]);
  const [mode, setMode] = useState("Drawing")
  const [selectedModel, setSelectedModel] = useState("");
  const [models, setModels] = useState([]);


  const modelData = {
    cabinet: {path:"./cabinet/cabinet.glb", scale: 5}
  }

  const addModel = () => {
   
    if (selectedModel) {
      setModels([...models, { id: models.length, file: selectedModel }]);
      
    }
  };

  const handleModelChange = (event) => {
    
    console.log(event.target.value)
    
    setSelectedModel(event.target.value);
  };

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
        height="65px"
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
           border="1px solid red"
          >

            {page === "2D" ? (
              <>
                <Button 
                variant="contained" 
                disabled={lines.length === 0} 
                onClick={handleOnClick} 
                startIcon={<ThreeDRotation/>}
                >
                  3D View
                </Button>
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
                <Button 
                  variant="contained" 
                  disabled={lines.length === 0} 
                  onClick={handleOnClick} 
                  startIcon={<MapIcon/>}
                >
                  2D View
                </Button>
                <FormControl variant="outlined" sx={{ minWidth: 120 , maxHeight: 20}} size="small">
                  <InputLabel >Model</InputLabel>

                  <Select value={selectedModel} onChange={handleModelChange}>
                    <MenuItem value="./cabinet/cabinet.glb">Cabinet</MenuItem>
                    <MenuItem value="./Sofa/untitled.gltf">Sofa</MenuItem>
                    {/* Add more options for other models */}
                  </Select>
                </FormControl>
                <Button variant="contained" onClick={addModel}>Add Model</Button>
              </>
            )
          }
          </Box>
        }
      </Box>

      
      <Box  
        width= "100%"
        height="100%"
      >
        {page === "2D" ? (
          <FloorPlan lines={lines} setLines={setLines} mode={mode} />
        ) : (
          <ThreeDrawing lines={lines} models={models} />
        )}
      </Box>
    </>
  );
}

export default App;
