import { configureStore } from '@reduxjs/toolkit'
import imagesReducer from './imagesSlice'

const store = configureStore({
    reducer: {
        images: imagesReducer
    }
})

store.subscribe(() => {
    console.log("== updated store: ", store.getState())
})
export default store