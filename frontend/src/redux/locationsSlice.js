// it means to choose the part of states from all states.
// 슬라이스는 전체 상태에서 부분 상태를 선택하는 것이기 때문에 'slice'라고 이름 붙여졌다

import { createSlice } from  '@reduxjs/toolkit'

const locationsSlice = createSlice({
    name: "locations",
    initialState: {
        cityName1: "",
        cityName2: "",
        count: 0
    
    },
    reducers: {
        updateLocation(state, action) {
            const city_info = action.payload;
            const city_name = city_info['city_name']

            if (!state.cityName1) {
                // cityName1이 비어있는 경우에 실행될 코드를 여기에 작성합니다.
                return {
                    ...state,
                    cityName1: city_name 
                };
            } else if (!state.cityName2){
                // cityName2이 비어있는 경우에 실행될 코드를 여기에 작성합니다.
                return {
                    ...state,
                    cityName2: city_name
                }
            } else if (state.count == 0){
                return {
                    ...state,
                    cityName1: city_name,
                    count: 1
                };
            } else if (state.count == 1) {
                return {
                    ...state,
                    cityName2: city_name,
                    count: 0
                };
            }
        },
        SubmitLocations(state, action) {
            const city_info = action.payload;
            const city_name1 = city_info['city_name1']
            const city_name2 = city_info['city_name2']

            return {
                ...state,
                cityName1: city_name1,
                cityName2: city_name2
            };
        }
    }
})

export default locationsSlice.reducer 
export const { updateLocation, SubmitLocations } = locationsSlice.actions
export const selectLocations = locationsSlice.selectSlice