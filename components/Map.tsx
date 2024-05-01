'use client';

import useGeolocation, { GeoLocation } from '@/hooks/useGeolocation';
import { useCallback, useEffect, useRef, useState } from 'react';
import Script from 'next/script';
import { NaverMap, BoxProps, MapProps, MarkerProps } from '@/types/map';
import { INITAIL_CENTER, INITIAL_ZOOM } from '../hooks/useMap';
import useSWR from 'swr';

const Map = ({
  mapId = 'map',
  initialCenter = INITAIL_CENTER,
  initialZoom = INITIAL_ZOOM,
  onLoad,
}: MapProps) => {
  const [currentMyLocation, setCurrentMyLocation] = useState<GeoLocation>({
    loaded: false,
    coordinates: initialCenter,
  });

  const mapRef = useRef<NaverMap | null>(null);
  const geolocation = useGeolocation();

  const { data: boxInfo } = useSWR('/api/boxinfo');

  useEffect(() => {
    geolocation.loaded
      ? setCurrentMyLocation({
          loaded: true,
          coordinates: [...geolocation.coordinates],
        })
      : setCurrentMyLocation({
          loaded: false,
          coordinates: initialCenter,
        });
  }, [geolocation.loaded]);

  useEffect(() => {
    if (boxInfo && currentMyLocation.loaded) {
      initializeMap();
    }
  }, [boxInfo, currentMyLocation.loaded]);

  const initializeMap = useCallback(() => {
    //지도 그리기
    const mapOption = {
      center: new window.naver.maps.LatLng(...currentMyLocation.coordinates),
      zoom: initialZoom,
      minZoom: 9,
      mapDataControl: false,
      logoControl: true,
      logoControlOptions: {
        position: window.naver.maps.Position.BOTTOM_RIGHT,
      },

      zoomControl: true,
      zoomControlOptions: {
        legendDisabled: true,
        style: naver.maps.ZoomControlStyle.SMALL,
        position: naver.maps.Position.RIGHT_TOP,
      },
    };

    const map = new window.naver.maps.Map(mapId, mapOption);
    mapRef.current = map;

    if (onLoad) {
      onLoad(map);
    }
  }, [currentMyLocation, initialZoom, boxInfo]);

  return (
    <>
      <Script
        src={`https://openapi.map.naver.com/openapi/v3/maps.js?ncpClientId=${process.env.NEXT_PUBLIC_NAVER_MAP_CLIENT_ID}`}
        onReady={() => {
          initializeMap();
        }}
        strategy="afterInteractive"
        type="text/javascript"
      />

      <div id={mapId} style={{ width: '100vw', height: '100vh' }} />
    </>
  );
};
export default Map;
