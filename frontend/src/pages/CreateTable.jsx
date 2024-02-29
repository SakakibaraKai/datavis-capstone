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
    const [ formData, setFormData ] = useState({})
    // Table and DB
    const [ TableName, setTableName ] = useState("")
    const [ DataBaseName, setDataBaseName ] = useState("")
    // DATE
    const [ Date, setDate ] = useState(false);
    const [ startDate, setStartDate] = useState('')
    const [ endDate, setEndDate] = useState('')

    const HandleDate = () => {
        setStartDate('')
        setEndDate('')
    }


    // Time
    const [ showTimeSelector, setShowTimeSelector ] = useState(false);
    const [ selectedTimes, setSelectedTimes ] = useState([])

    // max Temp range
    const [ isMaxTempSelected, setIsMaxTempSelected ] = useState(false);
    const [ maxlowTem, setMaxLowTemp ] = useState('')
    const [ maxhighTem, setMaxHighTemp ] = useState('')
    // Min Temp range
    const [ isMinTempSelected, setIsMinTempSelected ] = useState(false);
    const [ minlowTem, setMinLowTemp ] = useState('')
    const [ minhighTem, setMinHighTemp ] = useState('')

    // Pop
    const [ isPopSelected, setIsPopSelected ] = useState(false)
    const [ lowPop, setLowPop ] = useState('')
    const [ highPop, setHighPop] = useState('')

    const handleSubmit = (e) => {
        if (!DataBaseName) {
            console.error('Please Provide a DataBaseName');
            return
        }
        if (!TableName) {
            console.error("Please Provide a Table Name")
            return
        }
        // if Date exist
        if (Date) {
            setFormData({
                ...formData,
                date: {
                    startDate: startDate,
                    endDate: endDate
                }
            })
        }
        // if Time exist
        if (showTimeSelector) {
            setFormData({
                ...formData,
                time: selectedTimes
            })
        }
        // max Temp exist
        if  (isMaxTempSelected) {
            setFormData({
                ...formData,
                max_temp: {
                    max_high_temp: maxlowTem ,
                    max_low_temp: maxhighTem
                }
            })
        }
        // min Temp exist
        if (isMinTempSelected) {
            setFormData({
                ...formData,
                min_temp: {
                    min_high_temp: minlowTem,
                    min_low_temp: minhighTem
                }
            })
        }
        // Pop exist
        if (isPopSelected) {
            setFormData({
                ...formData,
                pop: {
                    high_pop: highPop,
                    low_pop: lowPop
                }
            })
        }
        // send Post to 8080:create
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
        })
        .catch(error => {
            console.error("fetch request error", error)
        })
    }
    // handle Date
    const handleDate = (e) => {
        //setDate(!Date);
        setDate(e.target.checked);
    }

    // handle time
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

    // handle max temp
    const handleSelectedMaxTemp=(e) => {
        setIsMaxTempSelected(e.target.checked)
    }
    const handleMinTempChange = (e) => {
        if (/^\d*\.?\d{0,1}$/.test(e.target.value) || e.target.value === '') {
            setMaxLowTemp(e.target.value);
        }
    };
    const handleMaxTempChange = (e) => {
        if (/^\d*\.?\d{0,1}$/.test(e.target.value) || e.target.value === '') {
            setMaxHighTemp(e.target.value);
        }
    };

    // handle min temp
    const handleSelectedMinTemp=(e) => {
        setIsMinTempSelected(e.target.checked)
    }
    const handleLowChange = (e) => {
        if (/^\d*\.?\d{0,1}$/.test(e.target.value) || e.target.value === '') {
            setMinLowTemp(e.target.value);
        }
    };
    const handleHighChange = (e) => {
        if (/^\d*\.?\d{0,1}$/.test(e.target.value) || e.target.value === '') {
            setMinHighTemp(e.target.value);
        }
    };

    // handle pop
    const handleSelectedPop = (e) => {
        setIsPopSelected(!isPopSelected)
    }
    const handleLowPopChange = (e) => {
        if (/^\d*\.?\d{0,2}$/.test(e.target.value) || e.target.value === '') {
            setLowPop(e.target.value);
        }
    };
    const handleHighPopChange = (e) => {
        if (/^\d*\.?\d{0,2}$/.test(e.target.value) || e.target.value === '') {
            setHighPop(e.target.value);
        }
    };




    return (
    <>
        <div>
            <div>
                {/* 이벤트의 기본 동작이 발생하지 않도록 하기 위해 이벤트 객체에서 호출하는 method */}
                <form className = "search-form" onSubmit={(e => {
                    e.preventDefault()
                    handleSubmit
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
                                    <input type="date"
                                        value = {startDate}
                                        onChange={(e)=>setStartDate(e.target.value)}
                                    />
                                </label>
                                <label>
                                    End Date:
                                    <input type="date"
                                        value = {endDate}
                                        onChange={(e)=> setEndDate(e.target.value)}
                                    
                                    />
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
                        <input 
                            type="checkbox" 
                            onClick={handleSelectedMaxTemp} />
                            <span>max temp</span>
                            {isMaxTempSelected && (
                            <div>
                                <label>
                                    Min Temperature: (℉)
                                    <input
                                        type="number"
                                        stemp ="0.1"
                                        value={maxlowTem}
                                        onChange={handleMinTempChange}
                                    />
                                </label>
                                <br />
                                <label>
                                    Max Temperature: (℉)
                                    <input
                                        type="number"
                                        step = "0.1"
                                        value={maxhighTem}
                                        onChange={handleMaxTempChange}

                                    />
                                </label>
                            </div>
                        )}
                    </label>


                    {/* min Temp */}
                     <label css ={labelStyle}>
                        <input 
                            type="checkbox" 
                            onClick={handleSelectedMinTemp} />
                            <span>min temp</span>
                            {isMinTempSelected && (
                            <div>
                                <label>
                                    Min Temperature: (℉)
                                    <input
                                        type="number"
                                        stemp ="0.1"
                                        value={maxlowTem}
                                        onChange={handleLowChange}
                                    />
                                </label>
                                <br />
                                <label>
                                    Max Temperature: (℉)
                                    <input
                                        type="number"
                                        step = "0.1"
                                        value={maxhighTem}
                                        onChange={handleHighChange}

                                    />
                                </label>
                            </div>
                        )}
                    </label>
                    
                    {/* Pop */}
                    <label css ={labelStyle}>
                        <input type="checkbox" onChange={handleSelectedPop} />
                        <span>POP</span>
                        {isPopSelected && (
                        <div>
                            <label>
                                Min Pop: (%)
                                <input
                                    type="number"
                                    stemp ="0.1"
                                    value={lowPop}
                                    onChange={handleLowPopChange}
                                />
                            </label>
                            <br />
                            <label>
                                Max Pop (%)
                                <input
                                    type="number"
                                    step = "0.1"
                                    value={highPop}
                                    onChange={handleHighPopChange}

                                />
                            </label>
                        </div>
                        )}
                    </label>
                    <button type = "submit" onClick={handleSubmit}>Create</button>
                </form>
            </div>
        </div>    
    </>
    )

}
