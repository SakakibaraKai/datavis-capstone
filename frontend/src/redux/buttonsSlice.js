import { createSlice } from  '@reduxjs/toolkit'

const buttonsSlice = createSlice({
    name: "buttons",
    initialState: {
        condition: false
    },
    reducers: {
        closebutton(state, action) {
            return {
                ...state,
                condition: false // Update the condition to "close"
            };
        },
        openbutton(state, action) {
            return {
                ...state,
                condition: true // Update the condition to "close"
            };
        }
    }
})

export default buttonsSlice.reducer 
export const { closebutton, openbutton } = buttonsSlice.actions
export const selectButtons = buttonsSlice.selectSlice