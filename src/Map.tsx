import { useEffect, useRef } from 'react';
declare global { interface Window { L: any } }
type Props = { lat: number; lon: number };

function ensureLeaflet(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (typeof window !== 'undefined' && window.L) return resolve();

    if (!document.querySelector('link[data-leaflet]')) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      link.setAttribute('data-leaflet', '1');
      document.head.appendChild(link);
    }

    const existing = document.querySelector<HTMLScriptElement>('script[data-leaflet]');
    if (existing) {
      existing.addEventListener('load', () => resolve());
      existing.addEventListener('error', () => reject(new Error('Leaflet script failed')));
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
    script.async = true;
    script.defer = true;
    script.setAttribute('data-leaflet', '1');
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Leaflet script failed'));
    document.body.appendChild(script);
  });
}

export default function Map({ lat, lon }: Props) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let map: any;
    (async () => {
      try {
        if (!lat || !lon || !ref.current) return;
        await ensureLeaflet();
        const L = window.L;
        map = L.map(ref.current).setView([lat, lon], 12);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; OpenStreetMap contributors'
        }).addTo(map);
        L.marker([lat, lon]).addTo(map);
      } catch (e) {
        console.error('Leaflet load/init error:', e);
      }
    })();
    return () => { try { map && map.remove(); } catch {} };
  }, [lat, lon]);

  return <div ref={ref} className="map" style={{ height: 300, borderRadius: 8, overflow: 'hidden' }} />;
}