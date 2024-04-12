import { useState, useEffect } from 'react';

interface IGeolocation {
  loaded: boolean;
  coordinates?: {
    lat: number;
    lng: number;
  };
  error?: { code: number; message: string };
}

const useGeolocation = () => {
  const [geolocation, setGeolocation] = useState<IGeolocation>({
    loaded: false,
    coordinates: { lat: 0, lng: 0 },
  });

  // 위치 정보 가져오기 성공 시 로직
  const onSuccess = (location: {
    cords: { latitude: number; longitude: number };
  }) => {
    setGeolocation({
      loaded: true,
      coordinates: {
        lat: location.cords.latitude,
        lng: location.cords.longitude,
      },
    });
  };

  // 위치 정보 가져오기 실패 시 로직
  const onError = (error: { code: number; message: string }) => {
    setGeolocation({
      loaded: true,
      error,
    });
  };

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
};

export default useGeolocation;
