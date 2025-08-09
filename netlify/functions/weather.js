export async function handler(event) {
  const OWM_KEY = process.env.OWM_KEY;
  const city = new URLSearchParams(event.rawQuery).get('city') || 'Monterrey';
  const API_KEY = process.env.OWM_KEY; // Para OpenWeather
  try {
    const r = await fetch(url);
    const d = await r.json();
    if (!r.ok || d.cod !== 200) {
      return { statusCode: 400, body: JSON.stringify({ error: d.message || 'weather error' }) };
    }
    const { lat, lon } = d.coord || {};
    return {
      statusCode: 200,
      body: JSON.stringify({
        temp: d.main?.temp,
        desc: d.weather?.[0]?.description,
        icon: d.weather?.[0]?.icon,
        country: d.sys?.country,
        lat, lon
      })
    };
  } catch {
    return { statusCode: 500, body: JSON.stringify({ error: 'server error' }) };
  }
}