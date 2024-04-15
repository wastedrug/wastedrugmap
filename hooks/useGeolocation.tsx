import { useState, useEffect } from 'react';
import { Coordinates } from '@/types/store';
import { INIITAIL_CENTER } from './useMap';

export type geoLocation = {
  loaded: boolean;
  coordinates: Coordinates;
  error?: { code: number; message: string };
};

export default function useGeolocation() {
  const [geolocation, setGeolocation] = useState<geoLocation>({
    loaded: false,
    coordinates: INIITAIL_CENTER,
  });

  // 위치 정보 가져오기 성공 시 로직
  const onSuccess = (position: {
    cords: { latitude: number; longitude: number };
  }) => {
    setGeolocation({
      loaded: true,
      coordinates: [position.cords.latitude, position.cords.longitude],
    });
  };

  // 위치 정보 가져오기 실패 시 로직
  const onError = (error: { code: number; message: string }) =>
    setGeolocation({
      loaded: false,
      coordinates: INIITAIL_CENTER,
      error: {
        code: error.code,
        message: error.message,
      },
    });

  useEffect(() => {
    // navigator 객체 안에 geolocation 객체가 없다면 위치 정보가 없다는것
    if (!('geolocation' in navigator)) {
      onError({
        code: 0,
        message: '현재 위치 정보를 가져올 수 없습니다.',
      });
    }

    navigator.geolocation.getCurrentPosition((position) => {
      onSuccess({
        cords: {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        },
      });
    }, onError);
  }, []);

  return geolocation;
}
