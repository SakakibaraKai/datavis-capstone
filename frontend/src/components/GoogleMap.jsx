import React, { useEffect } from 'react';
import { APIProvider, Map, Marker } from '@vis.gl/react-google-maps';

function GoogleMap() {
    useEffect(() => {
        const initMap = () => {
            const map = new google.maps.Map(document.getElementById("map"), {
                center: { lat: 44.5646, lng: -123.262 },
                zoom: 10,
                mapId: "4504f8b37365c3d0",
            });
            const marker = new google.maps.Marker({
                position: { lat: 44.5646, lng: -123.262 },
                map: map,
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
    }, []);

    return (
        React.createElement('div', { id: 'map', style: { width: '100%', height: '400px' } })
    );
}

export default GoogleMap;
