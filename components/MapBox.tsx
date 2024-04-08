'use client';
import { useEffect, useRef } from 'react';

export default function MapBox() {
  const mapElement = useRef<HTMLDivElement | null>(null);
  const lat = 37.3595704;
  const lng = 127.105399;

  useEffect(() => {
    const location = new naver.maps.LatLng(lat, lng);
    //지도 그리기
    const map = new naver.maps.Map('map', {
      center: location,
      zoomControl: true, // 줌 설정
      zoom: 15,
      zoomControlOptions: {
        style: naver.maps.ZoomControlStyle.SMALL,
        position: naver.maps.Position.TOP_RIGHT,
      },
    });
  }, [lat, lng]);
  return (
    <div>
      <script
        type="text/javascript"
        src={`https://oapi.map.naver.com/openapi/v3/maps.js?ncpClientId=${process.env.NEXT_PUBLIC_NAVER_MAP_CLIENT_ID}`}
      ></script>
      <div id="map" style={{ width: '100%', height: '500px' }}>
        <div ref={mapElement}></div>
      </div>
    </div>
  );
}
