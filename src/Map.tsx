import { useEffect, useRef } from 'react';

// Declaración mínima para Leaflet por CDN
declare global {
  interface Window { L: any }
}

type Props = { lat: number; lon: number };

export default function Map({ lat, lon }: Props) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!lat || !lon || !ref.current) return;
    const L = window.L;
    const map = L.map(ref.current).setView([lat, lon], 12);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution:'&copy; OpenStreetMap contributors'
    }).addTo(map);
    L.marker([lat, lon]).addTo(map);
    return () => map.remove();
  }, [lat, lon]);

  return (
    <>
      <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"/>
      <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
      <div ref={ref} className="map" />
    </>
  );
}