import { configureStore } from "@reduxjs/toolkit";
import linesSlice from "./features/lines";
import modeSlice from "./features/mode";

const store = configureStore({
    reducer:{
        lines: linesSlice,
        mode: modeSlice
    }
})


export default store