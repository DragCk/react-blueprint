/* eslint-disable no-unused-vars */
import EngineeringDrawing from "./drawing/Engineering.drawing";
import Drawing from "./fiber/Drawing.jsx";
import FloorPlan from "./drawing/FloorPlan.jsx";
import ThreeDrawing from "./fiber/Three.drawing.jsx";
import { useState } from "react";
import { Button, Box, Select, MenuItem, FormControl, InputLabel } from "@mui/material";
import { useSelector, useDispatch } from "react-redux";

import ModelDatas from "./fiber/components/ModelDatas.jsx"

/*---------Icons Import---------*/
import DeleteIcon from "@mui/icons-material/Delete"
import ClearIcon from "@mui/icons-material/Clear"
import DrawIcon from "@mui/icons-material/Draw"
import ThreeDRotation from '@mui/icons-material/ThreeDRotation';
import MapIcon from '@mui/icons-material/Map.js';

import { changeMode } from "./redux/features/mode.jsx"
import { clearLines } from "./redux/features/lines.jsx";

function App() {
  const [page, setPage] = useState("2D");
  //const [mode, setMode] = useState("Drawing")
  const [selectedModel, setSelectedModel] = useState("");
  const [models, setModels] = useState([]);
  const {lines} = useSelector((state) => state.lines)
  const {mode} = useSelector((state) => state.mode)

  const dispatch = useDispatch()
  

  const addModel = () => {
    
    if (selectedModel) {
      setModels([...models, { ...ModelDatas[selectedModel] , id: models.length}]);
      
    }
  };

  const handleModelChange = (event) => {
    setSelectedModel(event.target.value);
  };

  const handleOnClick = () => {
    if (page === "2D") setPage("3D");
    else setPage("2D");
  };

  const handleClean = () => {
    //setMode("Drawing")
    dispatch(changeMode("Drawing"))
    dispatch(clearLines())
  };


  const handleChangeMode = (m) => {
    dispatch(changeMode(m))
    
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
                    <MenuItem value="cabinet">Cabinet</MenuItem>
                    <MenuItem value="sofa">Sofa</MenuItem>
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
          <FloorPlan mode={mode} />
        ) : (
          <ThreeDrawing models={models} />
        )}
      </Box>
    </>
  );
}

export default App;
