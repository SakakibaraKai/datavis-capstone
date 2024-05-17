import React, { useEffect, useState } from 'react';
import { APIProvider, Map, Marker } from '@vis.gl/react-google-maps';
import { selectCities } from '../redux/citiesSlice.js';
import styled from '@emotion/styled'
import { css } from '@emotion/react'
import res from '../data/rain.json'
import icons from '../data/description.json'
import { useDispatch, useSelector } from 'react-redux'
import { updateLocation, selectLocations } from '../redux/locationsSlice.js'
import { selectButtons, closebutton } from '../redux/buttonsSlice';

// Black Board CSS
const MarkerInfoContainer = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
`;

const CloseButton = styled.button`
  color: white;
  margin: 1px;
  background-color: transparent;
  border: none;
  cursor: pointer;
`;

const Content = styled.div`
    width:100%;
    height:100%;
    justify-content: center; /* 가로 방향 가운데 정렬 */
`

const TopInfo = styled.div`
    width: 100%;
    height: 68%;
    justify-content: center;
`


const TodayInfo = styled.div`
    display: flex;
    justify-content: flex-start;
    margin-left: 10%;
    position: relative; /* 위치 지정을 위해 상대적인 위치 설정 */
`

const TypeButtonStyle = styled.div`
    display: flex;
    margin-left: 12%;
`
const BoldText = styled.p`
    font-weight: bold; /* 볼드체로 설정 */
    text-align: left;
`;

const LocationInfo = styled.div`
    display: flex;
    position: absolute; /* 위치 지정을 위해 절대적인 위치 설정 */
    right: 0; /* 오른쪽 끝에 위치하도록 설정 */
    margin-right: 10%;
`

// 도시 이름 말풍선 띄우기
const BoldWhiteText = styled.p`
    font-size: 30px;
    font-weight: bold;
    color: white;
    cursor: pointer;
`;

const Tooltip = styled.span`
    position: absolute;
    background-color: #333;
    color: #fff;
    padding: 5px;
    border-radius: 5px;
    visibility: ${props => props.show ? 'visible' : 'hidden'};
`;
// 도시 이름 말풍선 띄우기


// Precipitation Image
const ImageInfo = styled.div`
    width: auto;
    height: 100%;
    justify-content: center;
    margin-left: 3%;
`
const image_style = css`
    width: 100%; /* 이미지를 부모 요소의 너비에 맞게 설정 */
    height: auto; /* 가로 크기에 맞추면서 세로 비율은 유지됩니다. */
    //max-width: 1000px; /* 이미지의 최대 너비를 설정 */
    //max-height: 400px; /* 이미지의 최대 높이를 설정 */
`

const Icon = styled.div`
    width: 100%;
    height: 32%;
    display: flex;
    justify-content: center; /* 가로 중앙 정렬 */
    //align-items: flex-end; /* 세로 아래 정렬 */
    padding-bottom: 40px; /* 아이콘과 하단 여백을 추가 */
    margin-bottom: 100px;

`


const icon_style = css`
    maxWidth: 100%; /* 이미지의 너비를 100%로 설정합니다. */
    height: auto; /* 이미지의 높이를 자동으로 조정합니다. */

`

const kelvinToFahrenheit = (kelvin) => {
    return ((kelvin - 273.15) * 9/5) + 32;
};

export default function GoogleMap() {
    
    const cities = useSelector(selectCities)
    //console.log("==", cities['Corvallis']['city']['coord']['lat'])
    const [ markers, setMarkers ] = useState([])
    const [ selectedMarker, setSelectedMarker] = useState(null);
    const [ visualization, setVisualization ] = useState({})
    const [ selectedDate, setSelectedDate] = useState(null);
    const [ todayIcon, setTodayIcon ] = useState(null);
    const [ todayPrecip, setTodayPrecip ] = useState(null);
    const [ todayDate, setTodatDate ] = useState(null);
    const [ todayTemp, setTodayTemp ] = useState(null);
    const [ imageType, setimageType ] = useState("precip");
    const [ currentlocation, setCurrentLocation ] = useState(null);
    const [ clickedLocation, setClickLocation] = useState('');
    const dispatch = useDispatch();

    const handleClickLocation = (location) => {
        console.log("Location clicked:", location);
        dispatch(updateLocation({"city_name": location}))
    }
    
    

    const handleSetImageType = (type) => {
        setimageType(type)
    } 
    
    const handleMarkerClick = async (marker) => {
        try {
            setSelectedMarker(marker);
            const response = await fetch('http://host.docker.internal:8080/rain', {
                 method: 'POST',
                 headers: {
                     'Content-Type': 'application/json',
                 },
                 body: JSON.stringify(marker),
                 signal: controller.signal
             });
            // 이미지 정보를 처리하고 visualization 상태에 저장하는 코드
            setCurrentLocation(marker['cityName'])
            let i = 0
            const newVisualization = {};
            for (let key in res) {
                if (Object.prototype.hasOwnProperty.call(res, key)) {
                    const dateValue = res[key].date;
                    const precip_image = res[key].image_data1;
                    const temp_image = res[key].image_data2;
                    const des = res[key].description;
                    const temp = res[key].temperature;
                    const precip = res[key].precipitation;
                    const precip_ImageUrl = `data:image/png;base64,${precip_image}`;
                    const temp_ImageUrl = `data:image/png;base64,${temp_image}`;
                    // 새로운 이미지 정보를 임시 객체에 추가합니다.
                    newVisualization[key] = {
                        date: dateValue,
                        precip_image: precip_ImageUrl,
                        temp_image: temp_ImageUrl,
                        description: des
                    };
                    if (i==0) {
                        setTodayIcon(des)
                        setTodatDate(dateValue)
                        setTodayTemp(temp)
                        setTodayPrecip(precip)
                    }
                    i++;
                }
            }
            setSelectedDate("image_1")
            setVisualization(newVisualization);
        } catch(error) {
            console.error("fetch request error", error) 
        } finally {
        }
    };
    

    const handleCloseButtonClick = () => {
        setSelectedMarker(null);
        setimageType("precip")
    };

    // 말풍선 띄우기
    const BoldWhiteTextWithTooltip = ({ text }) => {
        const [showTooltip, setShowTooltip] = useState(false);
    
        const handleMouseEnter = () => {
            setShowTooltip(true);
        };
    
        const handleMouseLeave = () => {
            setShowTooltip(false);
        };
    
        return (
            <div style={{ position: 'relative', display: 'inline-block' }}>
                <BoldWhiteText onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} onClick={() => handleClickLocation(currentlocation)}>
                    {text}
                </BoldWhiteText>
                <Tooltip show={showTooltip}>Add to compare cities</Tooltip>
            </div>
        );
    };

    useEffect(() => {
        // cities가 변경될 때마다 마커를 업데이트합니다.
        const newMarkers = [];
        const cityNames = Object.keys(cities).filter(cityName => cities[cityName] !== null);
        cityNames.forEach(cityName => {
            const cityInfo = cities[cityName];
            const lat = cityInfo['city']['coord']['lat'];
            const lon = cityInfo['city']['coord']['lon'];
            newMarkers.push({
                cityName: cityName,
                position: [lat, lon]
            });
        });
        setMarkers(newMarkers);
    }, [cities]);

    useEffect(() => {
        const initMap = () => {
            const map = new google.maps.Map(document.getElementById("map"), {
                center: { lat: 44.5646, lng: -122.5 },
                zoom: 8,
                mapId: "4504f8b37365c3d0",
            });
            
            markers.forEach(marker => {
                const googleMarker = new google.maps.Marker({
                    position: { lat: marker.position[0], lng: marker.position[1] },
                    map: map,
                    icon: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'
                });

                // 마커를 클릭했을 때 이벤트 리스너 추가
                googleMarker.addListener('click', () => {
                    //setSelectedMarker(marker);
                    handleMarkerClick(marker)
                });
            });
        };



        // Google Maps API 스크립트를 동적으로 로드하고 initMap 함수를 window 객체에 할당
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyC1aB2jdQ76fRfyg2QefEKh2bbVNinoZzo&callback=initMap`;
        script.defer = true;
        script.async = true;
        window.initMap = initMap;
        document.head.appendChild(script);

        // 컴포넌트가 언마운트될 때 스크립트 제거
        return () => {
            document.head.removeChild(script);
            delete window.initMap;
        };
    }, [cities]);

    return (
        // 이 DIV는 구글 맵을 보여준다
        <div id="map" style={{ width: '100%', height: '100%' }}>
            {selectedMarker && (
                // 검은색 바탕화면을 보여준다
                <MarkerInfoContainer>
                    {/* 버튼 왼쪽에 배치  위쪽 모든 칸 차지*/}
                    <CloseButton onClick={handleCloseButtonClick}>X</CloseButton> 
                    <Content>
                        <TopInfo>
                            <TodayInfo>
                                <img 
                                    src={`http://openweathermap.org/img/wn/${icons[todayIcon]}@2x.png`} 
                                    style={{ 
                                        Width: '120px', // 이미지가 버튼의 가로 크기에 맞게 됩니다.
                                        height: '120px' // 가로 크기에 맞추면서 세로 비율은 유지됩니다.
                                    }} 
                                />
                                <div>
                                    <BoldText>{todayDate}</BoldText>
                                    <BoldText> Max Temperature: {kelvinToFahrenheit(todayTemp).toFixed(1)}°F</BoldText>
                                    <BoldText> Precipitation: {todayPrecip}%</BoldText>
                                </div>
                                <LocationInfo>
                                    {console.log(currentlocation)}
                                    <BoldWhiteTextWithTooltip text={currentlocation}/>
                                </LocationInfo>
                            </TodayInfo>
                            <TypeButtonStyle>
                                    <button onClick={() => handleSetImageType('precip')}>Precipitation</button>
                                    <button onClick={() => handleSetImageType('temp')}>Temp</button>
                            </TypeButtonStyle>

                            {/* 여기서부터는 강수량 / 온도 이미지 보여주기 */}
                            <ImageInfo>
                                {selectedDate && imageType === 'precip' && (
                                        <img src={visualization[selectedDate]['precip_image']} alt={`image_${selectedDate}`} css={image_style}/>
                                )}
                                {selectedDate && imageType === 'temp' && (
                                        <img src={visualization[selectedDate]['temp_image']} alt={`image_${selectedDate}`} css={image_style}/>
                                )}
                            </ImageInfo>
                        </TopInfo>
                        <Icon>
                            {Object.keys(visualization).map(date => {
                                //console.log("==date: ", visualization[date]['date'])
                                const dateInfo = visualization[date]['date'].split(' '); // 'Thu, 09 May 2024 00:00:00 GMT'를 공백을 기준으로 분할합니다.
                                const day = dateInfo[1]; // 일 정보를 추출합니다.
                                const month = dateInfo[2]; // 월의 줄임말을 추출합니다.
                                const formattedDate = `${month} ${day}`; // 월과 일을 합쳐서 포맷합니다.

                                return (
                                    <button 
                                        key={date} 
                                        style={{ 
                                            border: 'none', 
                                            background: 'none', 
                                            padding: 0, 
                                            margin: '6px', 
                                            alignItems: 'center', // 이미지와 텍스트를 수직으로 가운데 정렬합니다.
                                        }}
                                    >
                                        <img 
                                            src={`http://openweathermap.org/img/wn/${icons[visualization[date]['description']]}@2x.png`} 
                                            alt={`weather_icon_${date}`} 
                                            onClick={() => setSelectedDate(date)} 
                                            style={{ 
                                                maxWidth: '100%', // 이미지가 버튼의 가로 크기에 맞게 됩니다.
                                                height: 'auto', // 가로 크기에 맞추면서 세로 비율은 유지됩니다.
                                            }} 
                                        />
                                        <p style={{ fontSize: '18px', margin: '0 30px' }}>{formattedDate}</p>
                                    </button>
                                );
                            })}
                        </Icon>
                    </Content>
                </MarkerInfoContainer>
            )}
        </div>

    );
}

