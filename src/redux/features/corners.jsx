import { createSlice } from "@reduxjs/toolkit";

export const cornerSlice = createSlice({
    name: "Corners",
    initialState:{
        corners:[]
    },
    reducers:{
        setNewCorner: (state, action) => {
            state.corners = [...state.corners, action.payload]
        },
        setClearCorners: (state) => {
            state.corners = []
        },
        setUpdateCorner: (state,action) => {
            state.corners[action.payload.index] = [action.payload.x,action.payload.y]
        },
        setUpdateAllCorner: (state,action) => {
            state.corners = [...action.payload]
        }
    }

})


export const {setNewCorner, setClearCorners, setUpdateCorner, setUpdateAllCorner} = cornerSlice.actions

export default cornerSlice.reducer