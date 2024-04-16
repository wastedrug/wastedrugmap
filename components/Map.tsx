import useGeolocation from '@/hooks/useGeolocation';
import { useEffect, useRef, useState } from 'react';
import Script from 'next/script';
import { Coordinates } from '@/types/store';
import { NaverMap } from '@/types/map';
import { INITAIL_CENTER, INITIAL_ZOOM } from '../hooks/useMap';
import { GeoLocation } from '@/hooks/useGeolocation';

type MapProps = {
  mapId?: string;
  initialCenter?: Coordinates;
  initialZoom?: number;
  onLoad?: (map: NaverMap) => void;
};

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

  useEffect(() => {
    if (geolocation.loaded) {
      setCurrentMyLocation(geolocation);
    }
  }, [geolocation.loaded]);

  if (!currentMyLocation.loaded) return;

  const initializeMap = () => {
    //지도 그리기
    const mapOption = {
      center: new window.naver.maps.LatLng(...currentMyLocation.coordinates),
      zoom: initialZoom,
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
    new window.naver.maps.Marker({
      position: new window.naver.maps.LatLng(...currentMyLocation.coordinates),
      map: map,
    });
  };

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
