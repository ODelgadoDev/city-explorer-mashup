import { useState } from 'react';
import './App.css';
import './index.css';
import Map from './Map';
import {
  getWeather, getImages, convert, geocode
} from './api';
import type {
  Weather, ImageHit, ConvertResp, Geocode
} from './api';

export default function App() {
  // Input vacío por defecto
  const [city, setCity] = useState<string>('');
  const [weather, setWeather] = useState<Weather | null>(null);
  const [pics, setPics] = useState<ImageHit[]>([]);
  const [conv, setConv] = useState<ConvertResp | null>(null);
  const [coord, setCoord] = useState<Geocode | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [err, setErr] = useState<string>('');

  const buscar = async () => {
    const q = city.trim();
    if (!q) {
      setErr('Escribe una ciudad.');
      return;
    }

    setLoading(true);
    setErr('');
    setWeather(null);
    setCoord(null);
    setPics([]);
    setConv(null);

    try {
      const w = await getWeather(q);
      if ((w as any).error) throw new Error((w as any).error);
      setWeather(w);

      const g = await geocode(q);
      if (g.error || !g.lat) throw new Error(g.error || 'Geocoding no encontrado');
      setCoord(g);

      const i = await getImages(q);
      setPics(Array.isArray(i) ? i : []);

      const c = await convert('USD', 'MXN', 100);
      if (c.error) throw new Error(c.error);
      setConv(c);
    } catch (e: any) {
      console.error(e);
      setErr(e?.message || 'Error consultando APIs');
    } finally {
      setLoading(false);
    }
  };

  const onKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') buscar();
  };

  return (
    <div className="app-wrap" style={{ paddingTop: 12 }}>
      <h1 style={{ marginBottom: 12 }}>🏙️ City Explorer (Mashup)</h1>

      {/* Barra de búsqueda */}
      <div className="row" style={{ gap: 10, marginBottom: 10 }}>
        <input
          value={city}
          onChange={(e) => setCity(e.target.value)}
          onKeyDown={onKey}
          placeholder="Escribe una ciudad (ej. Buenos Aires, Madrid, Monterrey)..."
          className="input"
        />
        <button onClick={buscar} disabled={loading} className="btn">
          {loading ? 'Cargando...' : 'Buscar'}
        </button>
      </div>

      {/* Alertas */}
      {err && (
        <div className="alert" style={{ marginTop: 8, marginBottom: 10 }}>
          ⚠️ {err}
        </div>
      )}

      {/* Clima */}
      {weather && (
        <div className="panel" style={{ marginTop: 8, marginBottom: 10 }}>
          <h2 className="title" style={{ margin: 0 }}>
            {city.trim()} <span className="muted">/ {weather.country}</span>
          </h2>
          <p style={{ margin: 0 }}>🌡️ {weather.temp} °C — {weather.desc}</p>
        </div>
      )}

      {/* Mapa (reduce altura ajustando .map en App.css si quieres) */}
      {coord && (
        <div style={{ marginTop: 8, marginBottom: 10 }}>
          <Map lat={coord.lat} lon={coord.lon} />
        </div>
      )}

      {/* Conversión */}
      {conv && (
        <p className="text" style={{ marginTop: 4, marginBottom: 8 }}>
          💱 100 USD ≈ <b>{conv.result.toFixed(2)} MXN</b>{' '}
          <span className="muted">(tasa {conv.rate.toFixed(2)})</span>
        </p>
      )}

      {/* Imágenes */}
      {pics.length > 0 && (
        <div
          className="grid"
          style={{ gap: 8, marginTop: 8 }}
        >
          {pics.map((p, i) => (
            <a
              key={i}
              href={p.largeImageURL}
              target="_blank"
              rel="noreferrer"
              className="card"
              style={{ borderRadius: 10 }}
            >
              <img src={p.previewURL} alt="" />
            </a>
          ))}
        </div>
      )}
    </div>
  );
}