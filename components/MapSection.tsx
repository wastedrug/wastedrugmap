'use client';
import useMap from '@/hooks/useMap';
import Map from './Map';
import Markers from './Markers';
import { Coordinates } from '@/types/store';
import { NaverMap } from '@/types/map';

export const INITIAL_CENTER: Coordinates = [37.5666103, 126.9783882];
export const INITIAL_ZOOM = 10;

const MapSection = () => {
  const { initailizeMap } = useMap();

  const onLoadMap = (map: NaverMap) => {
    initailizeMap(map);
  };

  return (
    <>
      <Map onLoad={onLoadMap} />
      <Markers />
    </>
  );
};

export default MapSection;
