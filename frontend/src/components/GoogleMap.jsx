import React, { useEffect, useState } from 'react';
import { APIProvider, Map, Marker } from '@vis.gl/react-google-maps';
import { selectCities } from '../redux/citiesSlice.js';
import { useSelector } from 'react-redux'
import styled from '@emotion/styled'
import { css } from '@emotion/react'
import res from '../data/rain.json'

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
  margin: 3px;
  background-color: transparent;
  border: none;
  cursor: pointer;
`;

const image_style = css`
  width: 50%; /* 가로 크기 */
  height: 50%; /* 세로 크기 */
`

export default function GoogleMap() {
    const cities = useSelector(selectCities)
    //console.log("==", cities['Corvallis']['city']['coord']['lat'])
    const [ markers, setMarkers ] = useState([])
    const [selectedMarker, setSelectedMarker] = useState(null);
    const [ visualization, setVisualization ] = useState({})

    const handleImageButtonClick = (date) => {
        // 클릭된 버튼에 해당하는 이미지 URL 가져오기
        const imageUrl = visualization[date]['imageUrl'];
        
        // 가져온 이미지 URL을 이용하여 이미지 표시
        // 여기에서는 간단히 alert로 이미지 URL을 보여줍니다.
        alert(`Image URL for ${date}: ${imageUrl}`);
        // 여기에서 실제로 이미지를 표시하거나, 모달창 등을 사용하여 이미지를 더 시각적으로 표시할 수 있습니다.
    }

    const handleMarkerClick = (marker) => {
        try {
            setSelectedMarker(marker);
            //const response = await fetch('http://localhost:8080/rain', {
            //     method: 'POST',
            //     headers: {
            //         'Content-Type': 'application/json',
            //     },
            //     body: JSON.stringify(marker),
            //     signal: controller.signal
            // });
            // 이미지 정보를 처리하고 visualization 상태에 저장하는 코드
            for (let key in res) {
                console.log("==key: ", key)
                if (Object.prototype.hasOwnProperty.call(res, key)) {
                    const dateValue = res[key].date;
                    const imageDataValue = res[key].image_data;
                    const humidityImageUrl = `data:image/png;base64,${imageDataValue}`;
                    
                    // 각 이미지 정보를 visualization 상태에 추가
                    setVisualization(prevState => ({
                        ...prevState,
                        [key]: {
                            date: dateValue,
                            imageUrl: humidityImageUrl
                        }
                    }));
                }
            }

            console.log()
        } catch(error) {
            console.error("fetch request error", error) 
        } finally {
        }
    };

    const handleCloseButtonClick = () => {
        setSelectedMarker(null);
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
        <div id="map" style={{ width: '100%', height: '75%' }}>
            {selectedMarker && (
                <MarkerInfoContainer>
                    <CloseButton onClick={handleCloseButtonClick}>X</CloseButton>\
                    {Object.keys(visualization).map(date => (
                        <div>
                            <p>Date: {date}</p>
                            <img src={visualization[date]['imageUrl']} alt={`image_${date}`} css={image_style}/>
                            <button onClick={() => handleImageButtonClick(date)}>Show Image</button>
                            {console.log("== ", visualization[date]['imageUrl'])}
                        </div>
                    ))}
                </MarkerInfoContainer>
            )}
        </div>
    );
}

