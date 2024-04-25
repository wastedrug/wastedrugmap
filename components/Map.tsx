'use client';

import useGeolocation, { GeoLocation } from '@/hooks/useGeolocation';
import { useCallback, useEffect, useRef, useState } from 'react';
import Script from 'next/script';
import { NaverMap, BoxProps, MapProps } from '@/types/map';
import { INITAIL_CENTER, INITIAL_ZOOM } from '../hooks/useMap';
import useSWR from 'swr';

const fetcher = (url: string) =>
  fetch('/api/boxinfo ', {
    headers: {
      Accept: 'application / json',
      'Content-Type': 'application/json',
    },
    method: 'GET',
  }).then((res) => res.json());

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

  const { data: boxInfo } = useSWR('/api/boxinfo', fetcher);

  console.log('boxInfo', boxInfo);
  useEffect(() => {
    if (geolocation.loaded) {
    }
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
    renderMarkers(map);
  }, [currentMyLocation, initialZoom, boxInfo]);

  const renderMarkers = useCallback(
    (map: NaverMap) => {
      if (!boxInfo) return;

      boxInfo?.forEach((box: BoxProps) => {
        const marker = new window.naver.maps.Marker({
          position: new window.naver.maps.LatLng(box.latitude, box.longtitude),
          map: map,
        });
        const infoWindowContent = `<div> <b><h3>${box.addrDetails}</h3></b> </div>
      <div>  도로명주소 : ${box.roadAddr} </div>
      <div>  구분 : ${box.division} </div>
      <div>  담당부서 : ${box.management} </div>
      `;
        const infoWindow = new naver.maps.InfoWindow({
          content: infoWindowContent,
        });
        window.naver.maps.Event.addListener(marker, 'click', () => {
          if (infoWindow.getMap()) {
            infoWindow.close();
          } else {
            infoWindow.open(map, marker);
          }
        });
      });
    },
    [boxInfo],
  );

  useEffect(() => {
    const loadMapScript = () => {
      const script = document.createElement('script');
      script.src = `https://openapi.map.naver.com/openapi/v3/maps.js?ncpClientId=${process.env.NEXT_PUBLIC_NAVER_MAP_CLIENT_ID}`;
      script.async = true;
      script.defer = true;
      script.onload = () => {
        initializeMap();
      };
      document.body.appendChild(script);

      return () => {
        document.body.removeChild(document.getElementById(mapId)!);
      };
    };
    loadMapScript();
  }, [initializeMap, mapId]);

  return (
    <>
      <Script
        src={`https://openapi.map.naver.com/openapi/v3/maps.js?ncpClientId=${process.env.NEXT_PUBLIC_NAVER_MAP_CLIENT_ID}`}
        strategy="lazyOnload"
        type="text/javascript"
      />
      <div id={mapId} style={{ width: '100vw', height: '100vh' }} />
    </>
  );
};
export default Map;
