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

const MapBox = ({
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
    if (geolocation.loaded) {
      setMyLocation(geolocation);
    }
  }, [geolocation.loaded]);

  if (!myLocation || !myLocation.loaded) return;

  const initializeMap = () => {
    //지도 그리기
    const mapOption = {
      center: new window.naver.maps.LatLng(...myLocation.coordinates),
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
    // 지도에 마커 그리기
    const marker = new window.naver.maps.Marker({
      position: new window.naver.maps.LatLng(...myLocation.coordinates),
      map: map,
    });
  };
  return (
    <>
      <Script
        strategy="afterInteractive"
        type="text/javascript"
        src={`https://openapi.map.naver.com/openapi/v3/maps.js?ncpClientId=${process.env.NEXT_PUBLIC_NAVER_MAP_CLIENT_ID}`}
        onLoad={initializeMap}
      />
      <div id={mapId} style={{ width: '100vw', height: '100vh' }} />
    </>
  );
};
export default MapBox;
