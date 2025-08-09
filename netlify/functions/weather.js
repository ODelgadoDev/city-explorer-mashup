exports.handler = async (event) => {
  try {
    const OWM_KEY = process.env.OWM_KEY;
    const city = new URLSearchParams(event.rawQuery || '').get('city') || 'Monterrey';

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&units=metric&lang=es&appid=${OWM_KEY}`;
    const resp = await fetch(url);

    // Lee como texto para poder loguear errores de la API tal cual
    const raw = await resp.text();

    if (!resp.ok) {
      console.error('OWM error:', resp.status, raw);
      return {
        statusCode: resp.status,
        body: JSON.stringify({ error: `OWM ${resp.status}: ${raw}` })
      };
    }

    const d = JSON.parse(raw);
    if (d.cod && Number(d.cod) !== 200) {
      console.error('OWM non-200 payload:', d);
      return { statusCode: 400, body: JSON.stringify({ error: d.message || 'weather error' }) };
    }

    const { coord = {}, main = {}, weather = [], sys = {} } = d;
    return {
      statusCode: 200,
      body: JSON.stringify({
        temp: main.temp,
        desc: weather[0]?.description || '',
        icon: weather[0]?.icon || '',
        country: sys.country || '',
        lat: coord.lat,
        lon: coord.lon
      })
    };
  } catch (e) {
    console.error('weather crash:', e);
    return { statusCode: 500, body: JSON.stringify({ error: String(e) }) };
  }
};