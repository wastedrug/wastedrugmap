import { useEffect } from 'react';
import { ImageIcon, MarkerProps } from '@/types/map';

const Marker = ({ map, coordinates, icon, onClick }: MarkerProps) => {
  useEffect(() => {
    let marker: naver.maps.Marker | null = null;
    if (map) {
      marker = new window.naver.maps.Marker({
        position: new window.naver.maps.LatLng(...coordinates),
        map: map,
        icon,
      });
    }

    if (onClick) {
      window.naver.maps.Event.addListener(marker, 'click', onClick);
    }

    return () => {
      marker?.setMap(null);
    };
  }, [map]);

  return null;
};
export default Marker;
