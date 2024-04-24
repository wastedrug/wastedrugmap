import useGeolocation from '@/hooks/useGeolocation';
import { useEffect, useRef, useState } from 'react';
import Script from 'next/script';
import { Coordinates } from '@/types/store';
import { NaverMap } from '@/types/map';
import { INITAIL_CENTER, INITIAL_ZOOM } from '../hooks/useMap';
import { GeoLocation } from '@/hooks/useGeolocation';
import useMapList from '@/hooks/useMapList';

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

    const markers: any[] = [];
    const infoWindows: any[] = [];
    const mapList = useMapList();
    function getClickHandler(seq: any) {
      return function (e: any) {
        var marker = markers[seq],
          infoWindow = infoWindows[seq];

        if (infoWindow.getMap()) {
          infoWindow.close();
        } else {
          infoWindow.open(map, marker);
        }
      };
    }

    mapList.then((data) =>
      data?.map((x) => {
        const marker = new window.naver.maps.Marker({
          position: new window.naver.maps.LatLng(x.latitude, x.longtitude),
          map: map,
        });

        const infoWindow = new naver.maps.InfoWindow({
          content: `<div> <b><h3>${x.addrDetails}</h3></b> </div>
          <div>  도로명주소 : ${x.roadAddr} </div>
          <div>  구분 : ${x.division} </div>
          <div>  담당부서 : ${x.management} </div>
          `,
        });
        markers.push(marker);
        infoWindows.push(infoWindow);

        naver.maps.Event.addListener(
          markers[x.id - 1],
          'click',
          getClickHandler(x.id - 1),
        );
      }),
    );
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
