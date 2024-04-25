import MapSection from '@/components/MapSection';
import Map from '@/components/MapSection';
export default function Index() {
  return (
    <main
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        overflow: 'hidden',
      }}
    >
      <MapSection />
    </main>
  );
}
