import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import Slider from 'react-slider';
//      /** @jsxImportSource @emotion/react */
import styled from '@emotion/styled'
import { css } from '@emotion/react'

const NavContainer = styled.div`
  width: 800px; /* 고정된 너비 */
  height: 600px;
  margin-left: auto; /* 왼쪽으로만 증가 */
  position: relative; /* 위치 지정 */
  right: 0; /* 오른쪽 모서리 고정 */
`;
const Visualization = styled.div`
    display: flex;
    flex-direction: column;

`

const NavButton = styled.button`
  background-color: ${({ active }) => (active ? "#71b5ed" : "#2b7bbe")};
  color: ${({ active }) => (active ? "#fff" : "#000")};
  border: 2px solid #2b7bbe;
  border-radius: 3px;
  font-size: 16px;
  font-weight: 300;
  padding: 5px 10px;
  cursor: pointer;
  margin: 0 1px; /* 좌우 여백 추가 */
  display: inline-block; /* 인라인 블록 요소로 변경하여 수평으로 정렬 */

  &:hover {
    background-color: #71b5ed;
    color: #fff;
  }
`;

const Container = styled.div`
    width: 100%;
    height: 100%;
`;

export default function DataAnalysis() {
    const [activeNavItem, setActiveNavItem] = useState(""); // 선택된 네비게이션 아이템 상태

    // 네비게이션 항목 클릭 이벤트 핸들러
    const handleNavItemClick = (city) => {
      setActiveNavItem(city); // 선택된 네비게이션 아이템 업데이트
    };
    return (
      <>
        <Visualization>
          <NavContainer>
            {/* 네비게이션 항목들 */}
            <NavButton
                active={activeNavItem === "Humidity"}
            onClick={() => handleNavItemClick("Humidity")}
            >
              Humidity
            </NavButton>
            <NavButton
              active={activeNavItem === "Temperature"}
              onClick={() => handleNavItemClick("Temperature")}
            >
              Temperature
            </NavButton>
            <NavButton
              active={activeNavItem === "WindSpeed"}
              onClick={() => handleNavItemClick("WindSpeed")}
            >
              Wind Speed
          </NavButton>
          {activeNavItem && (
                  <Container style={{ border: "2px solid #71b5ed", padding: "10px" }}>
                  {/* 내용 */}
                  {activeNavItem === "Humidity" ? (
                    <p>Humidity Graph</p>
                  ) : activeNavItem === "Temperature" ? (
                    <p>Temperature Graph</p>
                  ) : activeNavItem === "Precipitation" ? (
                    <p>Precipitation Graph</p>
                  ) : activeNavItem === "WindSpeed" ? (
                    <p>Wind Speed Graph</p>
                  ) : null}
                </Container>
              )}
        </NavContainer>
      </Visualization>
        </>
    
    )
}
