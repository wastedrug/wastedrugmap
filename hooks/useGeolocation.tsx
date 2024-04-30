import { useState, useEffect } from 'react';
import { Coordinates } from '@/types/store';
import { INITAIL_CENTER } from './useMap';

export type GeoLocation = {
  loaded: boolean;

  coordinates: Coordinates;
  error?: { code: number; message: string };
};

export default function useGeolocation() {
  const [geolocation, setGeolocation] = useState<GeoLocation>({
    loaded: false,
    coordinates: INITAIL_CENTER,
  });

  // 위치 정보 가져오기 성공 시 로직
  const onSuccess = (position: GeolocationPosition) => {
    const { latitude, longitude } = position.coords;
    setGeolocation({
      loaded: true,
      coordinates: [latitude, longitude],
    });
  };

  // 위치 정보 가져오기 실패 시 로직
  const onError = (error: GeolocationPositionError) =>
    setGeolocation({
      loaded: false,
      coordinates: INITAIL_CENTER,
      error: {
        code: error.code,
        message: error.message,
      },
    });

  useEffect(() => {
    if (!navigator.geolocation) {
      onError({
        code: 0,
        message: '현재 위치 정보를 가져올 수 없습니다.',
        PERMISSION_DENIED: 1,
        POSITION_UNAVAILABLE: 2,
        TIMEOUT: 3,
      });
    } else {
      navigator.geolocation.getCurrentPosition(onSuccess, onError);
    }
  }, []);

  return geolocation;
}
