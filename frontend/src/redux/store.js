import { configureStore } from '@reduxjs/toolkit'
import imagesReducer from './imagesSlice'
import citiesReducer from './citiesSlice'
import locationsReducer from './locationsSlice'
import buttonsReducer from './buttonsSlice'

const store = configureStore({
    reducer: {
        images: imagesReducer,
        cities: citiesReducer,
        locations: locationsReducer,
        buttons: buttonsReducer
    }
})

store.subscribe(() => {
    console.log("== updated store: ", store.getState())
})
export default store