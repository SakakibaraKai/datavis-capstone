import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import Spinner from '../components/Spinner.jsx'
import ErrorContainer from '../components/ErrorContainer.jsx'
import WeatherCard from '../components/WeatherCard.jsx'
/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';

const labelStyle = css`
  /* label에 대한 스타일을 지정할 수 있습니다 */
  /* 예를 들어, 여기에는 label의 텍스트 스타일을 지정합니다 */
  font-weight: bold;
  display:block;
  color: blue;
`;


export default function CreateTable() {
    const [ Date, setDate ] = useState(false);
    const [ selectedTimes, setSelectedTimes ] = useState([])
    const [showTimeSelector, setShowTimeSelector] = useState(false);
    const [ TableName, setTableName ] = useState("")
    const [ DataBaseName, setDataBaseName ] = useState("")
    
    // handle Date
    const handleDate = (e) => {
        //setDate(!Date);
        setDate(e.target.checked);
    }

    const handleCheckboxChange = (e) => {
        const isChecked = e.target.checked;
        setShowTimeSelector(isChecked);
    };

    const handleTimeCheckboxChange = (e) => {
        const selectedTime = parseInt(e.target.value, 10);
        const isChecked = e.target.checked;

        if (isChecked) {
            setSelectedTimes([...selectedTimes, selectedTime]);
        } else {
            setSelectedTimes(selectedTimes.filter(time => time !== selectedTime));
        }
    };



    return (
    <>
        <div>
            <div>
                {/* 이벤트의 기본 동작이 발생하지 않도록 하기 위해 이벤트 객체에서 호출하는 method */}
                <form className = "search-form" onSubmit={(e => {
                    e.preventDefault()
                })}>
                   
                    {/* 테이블 이름 & 데이터베이스 이름  */}
                    
                    <input value={DataBaseName} placeholder = "Put db name" onChange = {e => {setDataBaseName(e.target.value)}} />
                    <input value={TableName} placeholder = "Put table name" onChange={e => {setTableName(e.target.value)}} />

                    {/* Date */}
                    <label css ={labelStyle}>
                        <input type="checkbox" onChange={handleDate} />
                        <span>date</span>
                        {Date && (
                            <div>
                                <label>
                                    Start Date:
                                    <input type="date" />
                                </label>
                                <label>
                                    End Date:
                                    <input type="date" />
                                </label>
                            </div>
                        )}
                    </label>


                    {/* 시간 체크박스 */}
                    <label css ={labelStyle}>
                        <input type="checkbox" onChange={handleCheckboxChange} />
                        <span>time</span>
                    </label>
                    {/* 시간 선택 체크박스 */}
                    {showTimeSelector && (
                        <div>
                            {[0, 3, 6, 9, 12, 15, 18, 21].map(time => (
                                <label key={time}>
                                    <input
                                        type="checkbox"
                                        value={time}
                                        checked={selectedTimes.includes(time)}
                                        onChange={handleTimeCheckboxChange}
                                    />
                                    {`${time.toString().padStart(2, '0')}:00`}
                                </label>
                            ))}
                        </div>
                    )}
            
                    {/* max Temp */}
                    <label css ={labelStyle}>
                        <input type="checkbox" onChange={(e) => {}} />
                        <span>max temp</span>
                    </label>

                    {/* min Temp */}
                    <label css ={labelStyle}>
                        <input type="checkbox" onChange={(e) => {}} />
                        <span>min temp</span>
                    </label>
                    <button type = "submit">Create</button>
                </form>
            </div>
        </div>


    
    </>
    )

}
