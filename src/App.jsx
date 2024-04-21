/* eslint-disable no-unused-vars */
import EngineeringDrawing from "./drawing/Engineering.drawing";
import Drawing from "./fiber/Drawing.jsx";
import FloorPlan from "./drawing/FloorPlan.jsx";
import ThreeDrawing from "./fiber/Three.drawing.jsx";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";
import { Button, Container } from "@mui/material";

function App() {
  const [page, setPage] = useState("2D");
  const [lines, setLines] = useState([]);
  const [intersectionPoints, setIntersetcionPoints] = useState([]);

  const handleOnClick = () => {
    if (page === "2D") setPage("3D");
    else setPage("2D");
  };

  const handleClean = () => {
    setLines([]);
  };

  return (
    <>
      <Container>
        {lines[0] ? (
          <div>
            <Button variant="contained" onClick={handleOnClick}>
              {page === "2D" ? "3D View" : "2D View"}
            </Button>
            {page === "2D" && (
              <Button variant="contained" onClick={handleClean}>
                Clean
              </Button>
            )}
          </div>
        ) : (
          <div>
            <p>Draw Blueprint</p>
          </div>
        )}
      </Container>
      {page === "2D" ? (
        <FloorPlan
          lines={lines}
          setLines={setLines}
          intersectionPoints={intersectionPoints}
          setIntersetcionPoints={setIntersetcionPoints}
        />
      ) : (
        <ThreeDrawing lines={lines} />
      )}
    </>
  );
}

export default App;
