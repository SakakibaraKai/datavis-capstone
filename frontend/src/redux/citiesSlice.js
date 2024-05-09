// it means to choose the part of states from all states.
// 슬라이스는 전체 상태에서 부분 상태를 선택하는 것이기 때문에 'slice'라고 이름 붙여졌다

import { createSlice } from  '@reduxjs/toolkit'

const citiesSlice = createSlice({
    name: "cities",
    initialState: {
        "Corvallis": null, // 초기값은 null 또는 다른 적절한 값으로 설정하세요
        "Salem": null, // 초기값은 null 또는 다른 적절한 값으로 설정하세요
        "Portland": null, // 초기값은 null 또는 다른 적절한 값으로 설정하세요
        "Eugene": null,
        "Bend": null,
        "Beaverton": null,
        "Hillsboro": null,
        "Gresham": null,
        "Lake Oswego": null,
        "Tigard": null,
        "Grants Pass": null,
        "Oregon City": null,
        "Roseburg": null,
        "Hood River": null
    },
    reducers: {
        updateCities(state, action) {
            const city_info = action.payload;
            const city_name = city_info['city_name']
            
            return {
                ...state,
                [city_name]: city_info // 해당 도시 이름을 키로 사용하여 city_info를 저장
            };
        }
    }
})

export default citiesSlice.reducer 
export const { updateCities } = citiesSlice.actions
export const selectCities = citiesSlice.selectSlice