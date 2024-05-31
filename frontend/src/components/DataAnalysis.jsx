import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import Slider from 'react-slider';
//      /** @jsxImportSource @emotion/react */
import styled from '@emotion/styled'
import { css } from '@emotion/react'
import { useDispatch, useSelector } from 'react-redux'
import { selectImages } from '../redux/imagesSlice';
import { closebutton } from '../redux/buttonsSlice';
//import { MdChevronLeft, MdChevronRight } from 'react-icons/md'; // 좌우 화살표 아이콘
//import { FaChevronLeft, FaChevronRight } from "react-icons/fa"; // 예시로 Font Awesome 아이콘을 사용합니다.
import { mdiChevronLeft, mdiChevronRight } from '@mdi/js';
import Icon from '@mdi/react';

const h1Style = {
    textAlign: 'center' // 텍스트를 중앙 정렬합니다.
  };
  

const Visualization = styled.div`
    position: absolute;
    top: 150px;
    left: 50%;
    transform: translateX(-50%);
    background-color: rgba(0, 0, 0, 0.5);
    border-radius: 10px;
    padding: 20px;
    color: white;
    width: 80%; /* 너비 설정 */
    height: 75%; /* 높이 설정 */

    display: flex;
    flex-direction: column;
`
const image_style = css`
  width: 800px; /* 가로 크기 */
  height: 600px; /* 세로 크기 */
`

const GraphWrapper = styled.div`
    display: flex;
    justify-content: space-between;
    width: 100%;
`;

const GraphImage = styled.img`
    ${image_style}
`;

const NavigationButton = styled.button`
    background: none;
    border: none;
    color: white;
    font-size: 24px;
    cursor: pointer;
`;

const CloseButton = styled.button`
  color: white;
  margin: 1px;
  background-color: transparent;
  border: none;
  cursor: pointer;
`;

export default function DataAnalysis() {
    const [index, setIndex] = useState(0);
    const dispatch = useDispatch();
    const graphslist = useSelector(selectImages)
    const [humidity_image, setHumidity] = useState('')
    const [max_temp_image, setMaxTemp] = useState('')
    const [min_temp_image, setMinTemp] = useState('')
    const [pressure_image, setPressure] = useState('')
    const graphs_name = [
        "Humidity Comparison",
        "Max Temperature Comparison",
        "Min Temperature Comparison",
        "Pressure Comparison"
    ];

    const getCurrentImage = () => {
        switch (index) {
            case 0:
                return humidity_image;
            case 1:
                return max_temp_image;
            case 2:
                return min_temp_image;
            case 3:
                return pressure_image;
            default:
                return '';
        }
    };

    useEffect(() => {
        setHumidity(`data:image/png;base64,${graphslist['humidity_image']}`)
        setMaxTemp(`data:image/png;base64,${graphslist['max_temp_image']}`)
        setMinTemp(`data:image/png;base64,${graphslist['min_temp_image']}`)
        setPressure(`data:image/png;base64,${graphslist['pressure_image']}`)
    }, [graphslist])

    const handleCloseButtonClick = () => {
        dispatch(closebutton())
    };

    const prevGraph = () => {
        setIndex(prevIndex => (prevIndex === 0 ? graphs.length - 1 : prevIndex - 1));
    };

    const nextGraph = () => {
        setIndex(prevIndex => (prevIndex === graphs.length - 1 ? 0 : prevIndex + 1));
    };

    const graphs = [humidity_image, max_temp_image, min_temp_image, pressure_image];

    return (
        <Visualization>
            <CloseButton onClick={handleCloseButtonClick}>X</CloseButton> 
            <h1 style={h1Style}>{graphs_name[index]}</h1>
            <GraphWrapper>
                <NavigationButton onClick={prevGraph}>
                    <Icon path={mdiChevronLeft} size={1} />
                </NavigationButton>
                <GraphImage src={getCurrentImage()} alt="Graph" />
                <NavigationButton onClick={nextGraph}>
                    <Icon path={mdiChevronRight} size={1} />
                </NavigationButton>
            </GraphWrapper>
        </Visualization>
    )
}
