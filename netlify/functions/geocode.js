export async function handler(event) {
  const city = new URLSearchParams(event.rawQuery).get('city') || 'Monterrey';
  const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(city)}&limit=1`;

  try {
    const r = await fetch(url, { headers: { 'User-Agent': 'CityExplorer/1.0 (educational)' }});
    const d = await r.json();
    if (!Array.isArray(d) || d.length === 0) {
      return { statusCode: 404, body: JSON.stringify({ error: 'not found' }) };
    }
    return { statusCode: 200, body: JSON.stringify({
      lat: Number(d[0].lat),
      lon: Number(d[0].lon),
      displayName: d[0].display_name
    })};
  } catch {
    return { statusCode: 500, body: JSON.stringify({ error: 'geocode error' }) };
  }
}