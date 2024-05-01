import useSWR from 'swr';
import Marker from './Marker';
import { MAP_KEY } from '@/hooks/useMap';
import { BoxProps, ImageIcon, NaverMap } from '@/types/map';
import { useCallback, useRef } from 'react';

const Markers = () => {
  const map = useSWR(MAP_KEY).data;

  const { data: boxInfo } = useSWR('/api/boxinfo');
  const DIVISION = {
    주민센터: '0',
    구청: '1',
    복지관: '2',
    '보건소(지소·분소)': '3',
    기타: '4',
  } as const;

  const convertDivision = (key: keyof typeof DIVISION) => {
    return parseInt(DIVISION[key as keyof typeof DIVISION]);
  };

  const generateInfoWindow = useCallback(
    (map: NaverMap) => {
      boxInfo?.forEach((box: BoxProps) => {
        const markerOptions = {
          position: new window.naver.maps.LatLng(box.latitude, box.longtitude),
          map: map,
          icon: generateMarkerImage(
            convertDivision(box.division as keyof typeof DIVISION),
          ),
        };
        const marker = new window.naver.maps.Marker(markerOptions);

        const content = `<div class='p-4'>
            <b class='text-lg'>${box.addrDetails}</b>
            <p>도로명 주소 : ${box.roadAddr}</p>
            <p>구분 : ${box.division}</p>
            <p>담당 부서 : ${box.telNo ? box.management + ' (' + `<a href="tel:${box.telNo}">` + box.telNo + `</a>` + ')' : box.management} </p>
            </div>`;

        const infoWindow = new window.naver.maps.InfoWindow({
          content,
          borderWidth: 2,
          borderColor:
            box.division === '주민센터'
              ? '#F1B940'
              : box.division === '구청'
                ? '#DD3121'
                : box.division === '복지관'
                  ? '#407A26'
                  : box.division === '보건소(지소·분소)'
                    ? '#D24186'
                    : '#275798',
        });
        window.naver.maps.Event.addListener(map, 'click', () => {
          if (infoWindow.getMap()) {
            infoWindow.close();
          }
        });
        // 마커 클릭시 정보창 열고 닫기
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

  return (
    <>
      {boxInfo?.map((box: BoxProps) => (
        <Marker
          map={map}
          coordinates={[box.latitude, box.longtitude]}
          icon={generateMarkerImage(
            parseInt(DIVISION[box.division as keyof typeof DIVISION]),
          )}
          key={box.id}
          onClick={() => generateInfoWindow(map)}
        />
      ))}
    </>
  );
};

export default Markers;

export function generateMarkerImage(markerIndex: number): ImageIcon {
  const MARKER_HEIGHT = 75;
  const MARKER_WIDTH = 50;
  const NUMBER_OF_MARKER = 5;
  const SCALE = 2 / 3;

  const SCALED_MARKER_WIDTH = MARKER_WIDTH * SCALE;
  const SCALED_MARKER_HEIGHT = MARKER_HEIGHT * SCALE;

  return {
    url: '/images/markerpin.png',
    size: new window.naver.maps.Size(SCALED_MARKER_WIDTH, SCALED_MARKER_HEIGHT),
    origin: new window.naver.maps.Point(SCALED_MARKER_WIDTH * markerIndex, 0),
    scaledSize: new window.naver.maps.Size(
      SCALED_MARKER_WIDTH * NUMBER_OF_MARKER,
      SCALED_MARKER_HEIGHT,
    ),
  };
}
