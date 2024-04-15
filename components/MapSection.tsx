import MapBox from './MapBox';

const MapSection = () => {
  return (
    <MapBox
      onLoad={() => {
        return console.log('loaded!');
      }}
    />
  );
};

export default MapSection;
