import { useState } from 'react';
import './App.css';
import './index.css';
import Map from './Map';
import { getWeather, getImages, convert, geocode } from './api';
import type { Weather, ImageHit, ConvertResp, Geocode } from './api';

export default function App() {
  const [city, setCity] = useState<string>('Monterrey');
  const [weather, setWeather] = useState<Weather | null>(null);
  const [pics, setPics] = useState<ImageHit[]>([]);
  const [conv, setConv] = useState<ConvertResp | null>(null);
  const [coord, setCoord] = useState<Geocode | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [err, setErr] = useState<string>('');

  const buscar = async () => {
    setLoading(true); setErr(''); setWeather(null); setCoord(null); setPics([]); setConv(null);
    try {
      const w = await getWeather(city);
      if ((w as any).error) throw new Error((w as any).error);
      setWeather(w);

      const g = await geocode(city);
      if (g.error || !g.lat) throw new Error(g.error || 'Geocoding no encontrado');
      setCoord(g);

      const i = await getImages(city);
      setPics(i);

      const c = await convert('USD', 'MXN', 100);
      if (c.error) throw new Error(c.error);
      setConv(c);
    } catch (e: any) {
      setErr(e?.message || 'Error consultando APIs');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-wrap">
      <h1>🏙️ City Explorer (Mashup)</h1>

      <div className="row">
        <input
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Ciudad..."
          className="input"
        />
        <button onClick={buscar} disabled={loading} className="btn">
          {loading ? 'Cargando...' : 'Buscar'}
        </button>
      </div>

      {err && <div className="alert">⚠️ {err}</div>}

      {weather && (
        <div className="panel">
          <h2 className="title">{city} <span className="muted">/ {weather.country}</span></h2>
          <p>🌡️ {weather.temp} °C — {weather.desc}</p>
        </div>
      )}

      {coord && <Map lat={coord.lat} lon={coord.lon} />}

      {conv && (
        <p className="text">
          💱 100 USD ≈ <b>{conv.result.toFixed(2)} MXN</b> <span className="muted">(tasa {conv.rate.toFixed(2)})</span>
        </p>
      )}

      <div className="grid">
        {pics.map((p, idx) => (
          <a key={idx} href={p.largeImageURL} target="_blank" rel="noreferrer" className="card">
            <img src={p.previewURL} alt="" />
          </a>
        ))}
      </div>
    </div>
  );
}