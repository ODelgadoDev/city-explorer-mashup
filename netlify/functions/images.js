export async function handler(event) {
  const PIXABAY_KEY = process.env.PIXABAY_KEY;
  const q = new URLSearchParams(event.rawQuery).get('query') || 'city';
  const API_KEY = process.env.PIXABAY_KEY; // Para Pixabay

  try {
    const r = await fetch(url);
    const d = await r.json();
    const hits = (d.hits || []).map(h => ({
      previewURL: h.webformatURL,
      largeImageURL: h.largeImageURL,
      tags: h.tags
    }));
    return { statusCode: 200, body: JSON.stringify(hits) };
  } catch {
    return { statusCode: 500, body: JSON.stringify({ error: 'images error' }) };
  }
}