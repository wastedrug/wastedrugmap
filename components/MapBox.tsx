'use client';
import useGeolocation from '@/hooks/useGeolocation';
import { useEffect, useRef, useState } from 'react';
import Script from 'next/script';
import { Coordinates } from '@/types/store';
import { NaverMap } from '@/types/map';
import { INIITAIL_CENTER, INITIAL_ZOOM } from '../hooks/useMap';
import { geoLocation } from '@/hooks/useGeolocation';
type mapProps = {
  mapId?: string;
  initailCenter?: Coordinates;
  initailZoom?: number;
  onLoad?: (map: NaverMap) => void;
};

const Map = ({
  mapId = 'map',
  initailCenter = INIITAIL_CENTER,
  initailZoom = INITIAL_ZOOM,
  onLoad,
}: mapProps) => {
  const [myLocation, setMyLocation] = useState<geoLocation>({
    loaded: false,
    coordinates: initailCenter,
  });
  const mapRef = useRef<NaverMap | null>(null);

  const geolocation = useGeolocation();

  useEffect(() => {
    setMyLocation(geolocation);
  }, [geolocation]);

  if (!myLocation || !myLocation.loaded || !myLocation.coordinates) return;
  initailCenter = myLocation.coordinates;
  const initializeMap = () => {
    //지도 그리기
    const mapOption = {
      center: new window.naver.maps.LatLng(...initailCenter),
      zoom: initailZoom,
      minZoom: 10,
      mapDataControl: false,
      logoControlOptions: {
        position: window.naver.maps.Position.BOTTOM_RIGHT,
      },
      zoomControlOptions: {
        style: naver.maps.ZoomControlStyle.SMALL,
        position: naver.maps.Position.TOP_RIGHT,
      },
    };

    const map = new window.naver.maps.Map(mapId, mapOption);
    mapRef.current = map;

    if (onLoad) {
      onLoad(map);
    }
  };

  // useEffect(() => {
  //   return () => {
  //     mapRef.current?.destroy();
  //   };
  // }, []);
  // // 마커 그리기

  // useEffect(() => {
  //   if (!window.naver) {
  //     const script = document.createElement('script');
  //     script.src = `https://openapi.map.naver.com/openapi/v3/maps.js?ncpClientId=${process.env.NEXT_PUBLIC_NAVER_MAP_CLIENT_ID}`;
  //     script.async = true;
  //     script.onload = () => initializeMap(); // Assign a function to onload event handler
  //     document.body.appendChild(script);
  //   } else {
  //     initializeMap();
  //   }
  // }, [geolocation]);

  return (
    <>
      <Script
        strategy="afterInteractive"
        type="text/javascript"
        src={`https://openapi.map.naver.com/openapi/v3/maps.js?ncpClientId=${process.env.NEXT_PUBLIC_NAVER_MAP_CLIENT_ID}`}
        onReady={initializeMap}
      />
      <div id={mapId} style={{ width: '100vw', height: '100vh' }} />
    </>
  );
};
export default Map;
