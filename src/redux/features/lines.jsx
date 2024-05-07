import { createSlice } from "@reduxjs/toolkit";

export const linesSlice = createSlice({
    name: "Lines",
    initialState:{
        lines:[],
    },
    reducers:{
        setNewLines: (state, action) => {
            state.lines = [...state.lines, action.payload]
        },
        setAfterDelete: (state,action) => {
            state.lines = [...action.payload]
        },
        clearLines: (state) => {
            state.lines = []
        }
    }


})

export const {setNewLines, clearLines, setAfterDelete } = linesSlice.actions

export default linesSlice.reducer