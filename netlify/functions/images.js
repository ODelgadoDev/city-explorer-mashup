exports.handler = async (event) => {
  try {
    const PIXABAY_KEY = process.env.PIXABAY_KEY;
    const q = new URLSearchParams(event.rawQuery || '').get('query') || 'city';

    const url = `https://pixabay.com/api/?key=${PIXABAY_KEY}&q=${encodeURIComponent(q)}&image_type=photo&per_page=8`;
    const resp = await fetch(url);
    const raw = await resp.text();

    if (!resp.ok) {
      console.error('PIXABAY error:', resp.status, raw);
      return { statusCode: resp.status, body: JSON.stringify({ error: `PIXABAY ${resp.status}: ${raw}` }) };
    }

    let d;
    try { d = JSON.parse(raw); } catch (e) {
      console.error('PIXABAY JSON parse error:', raw);
      return { statusCode: 500, body: JSON.stringify({ error: 'pixabay parse error' }) };
    }

    if (!Array.isArray(d.hits)) {
      console.error('PIXABAY payload:', d);
      return { statusCode: 400, body: JSON.stringify({ error: 'pixabay payload error' }) };
    }

    const hits = d.hits.map(h => ({
      previewURL: h.webformatURL,
      largeImageURL: h.largeImageURL,
      tags: h.tags
    }));
    return { statusCode: 200, body: JSON.stringify(hits) };

  } catch (e) {
    console.error('images crash:', e);
    return { statusCode: 500, body: JSON.stringify({ error: String(e) }) };
  }
};