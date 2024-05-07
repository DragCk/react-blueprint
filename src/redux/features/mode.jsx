import { createSlice } from "@reduxjs/toolkit";

export const modeSlice = createSlice({
    name: "Mode",
    initialState:{
        mode: "Drawing"
    },
    reducers:{
        changeMode: (state, action) => {
            state.mode = action.payload
        }
    }
})


export const {changeMode} = modeSlice.actions

export default modeSlice.reducer