// it means to choose the part of states from all states.
// 슬라이스는 전체 상태에서 부분 상태를 선택하는 것이기 때문에 'slice'라고 이름 붙여졌다

import { createSlice } from  '@reduxjs/toolkit'

const imagesSlice = createSlice({
    name: "images",
    initialState: {
        humidity_image: null, // 초기값은 null 또는 다른 적절한 값으로 설정하세요
        max_temp_image: null, // 초기값은 null 또는 다른 적절한 값으로 설정하세요
        min_temp_image: null,
        pressure_image: null, // 초기값은 null 또는 다른 적절한 값으로 설정하세요
    },
    reducers: {
        updateImages(state, action) {
            const { humidity_image, max_temp_image, min_temp_image, pressure_image } = action.payload;
            
            return {
                ...state,
                humidity_image,
                max_temp_image,
                min_temp_image,
                pressure_image
            };
        }
    }
})

export default imagesSlice.reducer 
export const { updateImages } = imagesSlice.actions
export const selectImages = imagesSlice.selectSlice