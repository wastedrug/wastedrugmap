'use client';

import { useCallback, useRef } from 'react';
import { Coordinates } from '../types/store';
import { NaverMap } from '@/types/map';

export const INITAIL_CENTER: Coordinates = [37.5666103, 126.9783882];
export const INITIAL_ZOOM: number = 15;

export const MAP_KEY = '/map';

const useMap = () => {
  const mapRef = useRef<NaverMap | null>(null);
  const initailizeMap = useCallback((map: NaverMap) => {
    mapRef.current = map;
  }, []);
  return {
    initailizeMap,
  };
};
export default useMap;
