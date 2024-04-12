'use client';
import useGeolocation from '@/hooks/useGeolocation';
import { initialize } from 'next/dist/server/lib/render-server';
import { useEffect, useRef, useState } from 'react';

export default function MapBox() {
  const mapElement = useRef<HTMLDivElement>(null);
  const currentMyLocation = useGeolocation(); // 현재 위치 정보 가져오기

  // const [lat, setLat] = useState<number>(37.5666);
  // const [lng, setLng] = useState<number>(126.979);

  // useEffect(() => {
  //   setLat(currentMyLocation?.coordinates?.lat);
  //   setLng(currentMyLocation?.coordinates?.lng);
  // }, [currentMyLocation]);

  const lat = currentMyLocation?.coordinates?.lat ?? 37.5666;
  const lng = currentMyLocation?.coordinates?.lng ?? 126.979;

  const initializeMap = () => {
    if (!window.naver || !mapElement.current) return;
    const location = new window.naver.maps.LatLng(lat, lng);
    //지도 그리기
    const map = new window.naver.maps.Map(mapElement.current, {
      center: location,
      zoomControl: true, // 줌 설정
      zoom: 15,
      zoomControlOptions: {
        style: naver.maps.ZoomControlStyle.SMALL,
        position: naver.maps.Position.TOP_RIGHT,
      },
    });
    // 마커 그리기
    new window.naver.maps.Marker({
      position: location,
      map: map,
    });
  };

  useEffect(() => {
    if (!window.naver) {
      const script = document.createElement('script');
      script.src = `https://openapi.map.naver.com/openapi/v3/maps.js?ncpClientId=${process.env.NEXT_PUBLIC_NAVER_MAP_CLIENT_ID}`;
      script.async = true;
      script.onload = initializeMap;
      document.body.appendChild(script);
    } else {
      initializeMap();
    }
  }, [lat, lng]);

  return (
    <div>
      <div ref={mapElement} style={{ width: '100vw', height: '100vh' }} />
    </div>
  );
}
