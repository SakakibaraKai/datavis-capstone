import { configureStore } from '@reduxjs/toolkit'
import imagesReducer from './imagesSlice'
import citiesReducer from './citiesSlice'

const store = configureStore({
    reducer: {
        images: imagesReducer,
        cities: citiesReducer
    }
})

store.subscribe(() => {
    console.log("== updated store: ", store.getState())
})
export default store