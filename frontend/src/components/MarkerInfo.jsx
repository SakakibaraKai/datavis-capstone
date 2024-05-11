import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import Slider from 'react-slider';
//      /** @jsxImportSource @emotion/react */
import styled from '@emotion/styled'
import { css } from '@emotion/react'
import { useDispatch, useSelector } from 'react-redux'
import { selectImages } from '../redux/imagesSlice';


const MarkerInfoContainer = styled.div`
  width: 100%;
  height: 75%;
  /* 여기에 원하는 CSS 스타일을 추가할 수 있습니다. */
`;


export default function MarkerInfo() {
    return (
        <MarkerInfoContainer>
            {console.log("fdsa")}
        </MarkerInfoContainer>
    );
}
