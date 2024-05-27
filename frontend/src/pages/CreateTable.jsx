import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import Spinner from '../components/Spinner.jsx'
import ErrorContainer from '../components/ErrorContainer.jsx'
import WeatherCard from '../components/WeatherCard.jsx'
//      /** @jsxImportSource @emotion/react */
import styled from '@emotion/styled'
import { css } from '@emotion/react'
import DataAnalysis from '../components/DataAnalysis.jsx'
import GoogleMap from '../components/GoogleMap.jsx'
// Redux
import { useDispatch, useSelector } from 'react-redux'
import { updateImages, selectImages } from '../redux/imagesSlice.js'
import { updateCities, selectCities } from '../redux/citiesSlice.js'
import { updateLocation, selectLocations, SubmitLocations } from '../redux/locationsSlice.js'
import { selectButtons, closebutton, openbutton } from '../redux/buttonsSlice.js'

const Platform = styled.div`
    width: 100%;    // 나중에 800px;
    height: 100vh;   // 나중에 600px;
    display: flex;
    align-items: center; /* 수직 가운데 정렬 */
    flex-direction: column; /* main axis를 바꿔 세로 방향으로 아이템을 배치 */
`
const InputStyle = styled.input`
    margin-bottom: 10px;
    width: 30vw;    // vw: 가로 너비가 줄어들게 함
    height: 3vh;    
    border-radius: 20px;
    text-align: center;  // 텍스트 관련요소
`;

const SearchCity = styled.div`
  display: flex;
  margin-top: 8px;
  margin-bottom: 35px;
  margin-left: 25px;
  margin-right: 25px;
  // width와 height 로 크기 지정
  height: 70px;
`;

const CityBox = styled.div`
  display: flex;
  flex-direction: column;
`
const Loading = styled.div`
  align-items: center;
  flex-direction: column;
`

const Button = styled.button`
    height: 80px;
    width: 120px;
    background-color: #2b7bbe;
    color: #fff;
    //border: 2px solid #2b7bbe;
    border-radius: 3px;
    font-size: 18px;
    font-weight: 300;
    padding: 5px 20px;
    margin: 5px;
    cursor: pointer;
    

    &:hover {
        background-color: #71b5ed;
    }
`;

const validCities = ["Corvallis", "Hood River", "Gresham", "Portland", "Oregon City", "Lake Oswego", "Tigard", "Beaverton", "Hillsboro", "Salem", "Eugene", "Bend", "Roseburg", "Grants Pass"];

export default function CreateTable() {
    // cityName1 AND cityName2
    const [ cityName1, setCityName1 ] = useState("")
    const [ cityName2, setCityName2 ] = useState("")
    const [ formData, setFormData ] = useState({})
    const [ submitButton, setSubmitButton ] = useState(false)
    const [ visualization, setVisualization ] = useState({})
    const [ loading, setLoading ] = useState(false);
    const [ error, setError ] = useState(null);
    const [ isfetched, setIsfetched ] = useState(false);
    const [ humidity_img, setHumidityImage ] = useState("")
    const [ temp_max_img, setTempMaxImage ] = useState("")
    const [ temp_min_img, setTempMinImage ] = useState("")   
    const [ pressure_img, setPressureImage ] = useState("")
    const city_name = useSelector(selectLocations)
    const updated_cityName1 = useSelector(state => state.locations.cityName1);
    const updated_cityName2 = useSelector(state => state.locations.cityName2);
    const buttonCondition = useSelector(selectButtons); // closeCondition을 상태 값으로 가져옵니다.

    // redux dispatch: 특정 액션, 이벤트를 전송한다라는 의미 
    const dispatch = useDispatch();
    const graphlist = useSelector(selectImages)
    const cities = useSelector(selectLocations)
    console.log("==2222:", cities)


    console.log("==", buttonCondition.condition); // condition 값 확인
    
    const handleCityNameChange = (e) => {
        const value = e.target.value;
        setCityName1(value);
    }
    

    const handleInputComplete1 = () => {
        dispatch(updateLocation({ city_name: cityName2 }));
    }

    const handleInputComplete2 = () => {
        dispatch(updateLocation({ city_name: cityName2 }));
    }
    


    const handleSubmit = async (e) => {
        const controller = new AbortController();
        // cityName1 이 빈 배열 || (compareCity 가 참이고 동시에 cityName2가 빈 배열)
        dispatch(openbutton())

        dispatch(SubmitLocations({"city_name1": cityName1, "city_name2": cityName2}))

        if (!cityName1 || !cityName2) {
            alert('Please Provide city names');
            return
        }

        //  경고 이름 띄우기
        if (!validCities.includes(cityName1))
        {
            alert("Please enter one of the valid cities: Corvallis, Hood River, Gresham, Portland, Oregon City, Lake Oswego, Tigard, Beaverton, Hillsboro, Salem, Eugene, Bend, Roseburg, Grants Pass");
            setCityName1("")
            return
        } else if (!validCities.includes(cityName2)){
            alert("Please enter one of the valid cities: Corvallis, Hood River, Gresham, Portland, Oregon City, Lake Oswego, Tigard, Beaverton, Hillsboro, Salem, Eugene, Bend, Roseburg, Grants Pass");
            setCityName2("")
            return
        }

        setLoading(true)
        setIsfetched(false)
        // cityName1 추가
        setFormData({
            city_name1: cityName1,
            city_name2: cityName2
        })
        
        try {
            const response = await fetch('http://localhost:8080/create', {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
                signal: controller.signal
            });
            const data = await response.json();
            //const data = graphs
            //console.log("==Graphs: ", graphs)
            setVisualization(data)
            if (visualization) {
                // 이미지 데이터를 바로 사용하기
                const HumidityImageUrl = `data:image/png;base64,${visualization['humidity_img']}`;
                setHumidityImage(HumidityImageUrl);
                // 다른 이미지도 동일한 방법으로 처리
                const tempMaxImageUrl = `data:image/png;base64,${visualization['max_temp_img']}`;
                setTempMaxImage(tempMaxImageUrl);

                const tempMinImageUrl = `data:image/png;base64,${visualization['min_temp_img']}`;
                setTempMinImage(tempMinImageUrl);

                const pressureImageUrl = `data:image/png;base64,${visualization['pressure_img']}`;
                setPressureImage(pressureImageUrl);
                dispatch(updateImages({
                    "humidity_image": visualization['humidity_img'],
                    "max_temp_image": visualization['max_temp_img'],
                    "min_temp_image": visualization['min_temp_img'],
                    "pressure_image": visualization['pressure_img'],
                    
                }))
            }

        } catch(error) {
            console.error("fetch request error", error) 
        } finally {
            setSubmitButton(prev => !prev)
            setLoading(false)
            setIsfetched(true)
        }
    }

    const handleUpdate = async (e) => {
        const controller = new AbortController();
        try {
            const response = await fetch('http://localhost:8080/update-table', {
            //const response = await fetch('../data/response.json', {
                method: 'GET',
                signal: controller.signal
            })
            const res = await response.json();
            const cityInfo = res['cities_info']
            for (const cityName in cityInfo) {
                if (cityInfo.hasOwnProperty(cityName)) {
                    
                    const cityData = cityInfo[cityName];
                    console.log(cityData); // 각 도시의 데이터 확인
                    dispatch(updateCities({ city_name: cityName, city_location: cityData })); // 도시 데이터 업데이트
                }
            }
        }catch(error) {
            console.error("Update error", error);
        }finally {
            
        }
    }

    // cityName1이 변경될 때마다 실행되는 효과
    useEffect(() => {
        // cityName1이 변경될 때 수행할 작업을 여기에 추가합니다.
        // 예시: cityName1이 변경될 때마다 someState를 업데이트합니다.
        setCityName1(updated_cityName1);
        setCityName2(updated_cityName2);
        
    }, [updated_cityName1, updated_cityName2]); // cityName1 변수를 의존성 배열에 포함시켜 변경될 때마다 useEffect가 실행되도록 합니다.

    

    return (
        <Platform>
            {/* 이벤트의 기본 동작이 발생하지 않도록 하기 위해 이벤트 객체에서 호출하는 method */}
            <form className = "search-form" onSubmit={(e => {
                e.preventDefault()
                handleSubmit
            })}>
                <SearchCity>       
                    <CityBox>
                        <InputStyle 
                            value={cityName1} 
                            placeholder="City Name 1" 
                            onChange = {e => {setCityName1(e.target.value)}}
                            onBlur={handleInputComplete1} // 입력이 완료될 때 호출됩니다.
                        />
                        <InputStyle 
                            value={cityName2} 
                            placeholder="City Name 2" 
                            onChange = {e => {setCityName2(e.target.value)}}
                            onBlur={handleInputComplete2} // 입력이 완료될 때 호출됩니다.
                        />
                    </CityBox>
                    <Button type = "submit" onClick={handleSubmit}> Compare</Button>
                    <Button type = "submit" onClick={handleUpdate}> Update</Button>
                </SearchCity>
            </form>
            <Loading>
                {error && <ErrorContainer />}
                {loading && <Spinner />}
            </Loading>
            <GoogleMap />
            {buttonCondition.condition && <DataAnalysis />}
            {/*isfetched &&<DataAnalysis />*/}

        </Platform> 
    )
}
