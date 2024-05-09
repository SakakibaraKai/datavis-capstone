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
import res from '../data/response.json';
// Redux
import { useDispatch, useSelector } from 'react-redux'
import { updateImages, selectImages } from '../redux/imagesSlice.js'
import { updateCities, selectCities } from '../redux/citiesSlice.js'

const Platform = styled.div`
    width: 100%;    // 나중에 800px;
    height: 100vh;   // 나중에 600px;
    display: flex;
    align-items: center; /* 수직 가운데 정렬 */
    flex-direction: column; /* main axis를 바꿔 세로 방향으로 아이템을 배치 */
`
const InputStyle = styled.input`
    margin-bottom: 10px;
    width: 40vw;    // vw: 가로 너비가 줄어들게 함
    height: 3vh;    
    border-radius: 20px;
    text-align: center;  // 텍스트 관련요소
`;

const SearchCity = styled.div`
  display: flex;
  margin: 60px;
  // width와 height 로 크기 지정
  width: auto;
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
    const [ temp_max_img, setTempMaxImage ] = useState(null)   
    const [ pressure_img, setPressureImage ] = useState(null)

    // redux dispatch: 특정 액션, 이벤트를 전송한다라는 의미 
    const dispatch = useDispatch();
    const graphlist = useSelector(selectImages)

    const handleSubmit = async (e) => {
        setLoading(true)
        setIsfetched(false)
        const controller = new AbortController();
        // cityName1 이 빈 배열 || (compareCity 가 참이고 동시에 cityName2가 빈 배열)
        if (!cityName1 || !cityName2) {
            console.error('Please Provide city name');
            return
        }

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
            setVisualization(data)
            if (visualization) {
                // 이미지 데이터를 바로 사용하기
                const HumidityImageUrl = `data:image/png;base64,${visualization['humidity_image']}`;
                setHumidityImage(HumidityImageUrl);
                // 다른 이미지도 동일한 방법으로 처리
                const tempMaxImageUrl = `data:image/png;base64,${visualization['max_temp_image']}`;
                setTempMaxImage(tempMaxImageUrl);

                const pressureImageUrl = `data:image/png;base64,${visualization['pressure_image']}`;
                setPressureImage(pressureImageUrl);
                dispatch(updateImages({
                    "humidity_image": visualization['humidity_image'],
                    "max_temp_image": visualization['max_temp_image'] ,
                    "pressure_image": visualization['pressure_image']
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
            /*
            //fetch('http://localhost:8080/update-table'
            const response = await fetch('../data/response.json', {
                method: 'GET',
                signal: controller.signal
            })
            */
                       
            //console.log("== response: ", response['cities_info'])
            //const res = await response.json();
            console.log("==res: ", res)
            console.log("res[0]:", res['cities_info'][0])
            for(let i = 0; i < res['cities_info'].length; i++) {
                console.log("==city name: ", res['cities_info'][i]['city_name'])
                dispatch(updateCities(res['cities_info'][i]))
            }
        }catch(error) {
            console.error("Update error", error);
            
        }finally {
            
        }


    }
    


    return (
        <Platform>
            {/* 이벤트의 기본 동작이 발생하지 않도록 하기 위해 이벤트 객체에서 호출하는 method */}
            <form className = "search-form" onSubmit={(e => {
                e.preventDefault()
                handleSubmit
            })}>
                <SearchCity>       
                    <CityBox>
                        <InputStyle value={cityName1} placeholder = "City Name 1" onChange = {e => {setCityName1(e.target.value)}} />
                        <InputStyle value={cityName2} placeholder = "City Name 2" onChange = {e => {setCityName2(e.target.value)}} />
                    </CityBox>
                    <Button type = "submit" onClick={handleSubmit}> Compare</Button>
                    <Button type = "submit" onClick={handleUpdate}> Update</Button>
                </SearchCity>
            </form>
            <Loading>
                {error && <ErrorContainer />}
                {loading && <Spinner />}
            </Loading>
            {isfetched ? <DataAnalysis /> : <GoogleMap />}
            {/*isfetched &&<DataAnalysis />*/}

        </Platform> 
    )
}
