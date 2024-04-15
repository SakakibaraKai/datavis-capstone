import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import Spinner from '../components/Spinner.jsx'
import ErrorContainer from '../components/ErrorContainer.jsx'
import WeatherCard from '../components/WeatherCard.jsx'
import Slider from 'react-slider';
//      /** @jsxImportSource @emotion/react */
import styled from '@emotion/styled'
import { css } from '@emotion/react'
import DataAnalysis from '../components/DataAnalysis.jsx'


const Platform = styled.div`
    width: 1000px;
    height: 400px;
    display: flex;
    align-items: center; /* 수직 가운데 정렬 */
    flex-direction: column; /* 세로 방향으로 아이템을 배치 */
`
const InputStyle = styled.input`
    margin-bottom: 10px;
    width: 40vw;
    height: 3vh;
    border-radius: 20px;
    text-align: center;
`;

const SearchCity = styled.div`
  display: flex;
  margin: 50px;
  // width와 height 로 크기 지정
  width: 150px;
  height: 50px;

`;

const CityBox = styled.div`
  display: flex;
  flex-direction: column;
`
const ButtonWrapper = styled.div`
  align-items: center;
`;

const Button = styled.button`
    height: 80px;
    background-color: #2b7bbe;
    color: #fff;
    border: 2px solid #2b7bbe;
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

    const handleSubmit = (e) => {


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

        fetch('http://localhost:8080/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
            
        })
        .then(response => {
            if(!response.ok) {
                throw new Error('BackEnd Server is closed')
            }
            console.log("Successfully Request sent")
            return response.json();
        })
        .then(data => {
            setVisualization(data)
        })
        .catch(error => {
            console.error("fetch request error", error)
        })

        setSubmitButton(prev => !prev)
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
                </SearchCity>
            </form>
            {submitButton && <DataAnalysis />}
            {console.log("==visualization: ", visualization)}
        </Platform> 
    )

}
