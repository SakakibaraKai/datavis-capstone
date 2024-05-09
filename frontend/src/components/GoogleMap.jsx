import React, { useEffect, useState } from 'react';
import { APIProvider, Map, Marker } from '@vis.gl/react-google-maps';
import { selectCities } from '../redux/citiesSlice.js';
import { useSelector } from 'react-redux'

function GoogleMap() {
    const cities = useSelector(selectCities)
    //console.log("==", cities['Corvallis']['city']['coord']['lat'])
    const [ markers, setMarkers ] = useState([])
    const [ isClick, setisClick ] = useState([])

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
                new google.maps.Marker({
                    position: { lat: marker.position[0], lng: marker.position[1] },
                    map: map,
                    icon: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'
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
        React.createElement('div', { id: 'map', style: { width: '100%', height: '75%' } })
    );
}

export default GoogleMap;
