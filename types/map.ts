import { Coordinates } from './store';

export type NaverMap = naver.maps.Map;

export type BoxProps = {
  id: number;
  roadAddr: string;
  addrDetails: string;
  telNo: string;
  management: string;
  division: string;
  latitude: number;
  longtitude: number;
  created_at: string;
  updated_at: string;
};

export type MapProps = {
  mapId?: string;
  initialCenter?: Coordinates;
  initialZoom?: number;
  onLoad?: (map: NaverMap) => void;
};

export type MarkerProps = {
  map : NaverMap;
  coordinates : Coordinates;
  icon : ImageBitmapRenderingContext;
  onClick : () => void; 
};

export type ImageIcon = {
  url : string;
  size : naver.maps.Size;
  origin : naver.maps.Point;
  scaledSize?: naver.maps.Size;
};