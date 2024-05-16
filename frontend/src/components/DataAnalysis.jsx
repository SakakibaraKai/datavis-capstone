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
    height: 65%; /* 높이 설정 */

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

    const handleCloseButtonClick = () => {
        dispatch(closebutton())
    };

    const prevGraph = () => {
      setIndex(prevIndex => (prevIndex === 0 ? graphs.length - 1 : prevIndex - 1));
  };

  const nextGraph = () => {
      setIndex(prevIndex => (prevIndex === graphs.length - 1 ? 0 : prevIndex + 1));
  };

    const graphslist = useSelector(selectImages)
    //const [ visualization, setVisualization ] = useState[{}] 
    //console.log("==graph", graphslist)

    // 이미지 데이터를 바로 사용하기
    const humidityImageUrl = `data:image/png;base64,${graphslist['humidity_image']}`;
      // 다른 이미지도 동일한 방법으로 처리
    const tempMaxImageUrl = `data:image/png;base64,${graphslist['max_temp_image']}`;
    //setTempMaxImage(tempMaxImageUrl);

    const tempMinImageUrl = `data:image/png;base64,${graphslist['min_temp_image']}`;

    const pressureImageUrl = `data:image/png;base64,${graphslist['pressure_image']}`;
     // setPressureImage(pressureImageUrl);


    const graphs = [
      `data:image/png;base64,${graphslist['humidity_image']}`,
      `data:image/png;base64,${graphslist['max_temp_image']}`,
      `data:image/png;base64,${graphslist['min_temp_image']}`,
      `data:image/png;base64,${graphslist['pressure_image']}`
    ];
    return (
        <Visualization>
            <CloseButton onClick={handleCloseButtonClick}>X</CloseButton> 
            <GraphWrapper>
                <NavigationButton onClick={prevGraph}>
                    <Icon path={mdiChevronLeft} size={1} />
                </NavigationButton>
                <GraphImage src={graphs[index]} alt="Graph" />
                <NavigationButton onClick={nextGraph}>
                    <Icon path={mdiChevronRight} size={1} />
                </NavigationButton>
            </GraphWrapper>
        </Visualization>
    )
}
