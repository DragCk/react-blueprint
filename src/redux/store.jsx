import { configureStore } from "@reduxjs/toolkit";
import linesSlice from "./features/lines";
import modeSlice from "./features/mode";
import cornersSlice from "./features/corners"

const store = configureStore({
    reducer:{
        lines: linesSlice,
        mode: modeSlice,
        corners: cornersSlice
    }
})


export default store