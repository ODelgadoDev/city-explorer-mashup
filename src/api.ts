const BASE = ''; // relativo: /api -> /.netlify/functions en Netlify

export type Weather = {
  temp: number;
  desc: string;
  icon?: string;
  country?: string;
  lat: number;
  lon: number;
  error?: string;
};

export type ImageHit = {
  previewURL: string;
  largeImageURL: string;
  tags?: string;
};

export type ConvertResp = {
  result: number;
  rate: number;
  error?: string;
};

export type Geocode = {
  lat: number;
  lon: number;
  displayName: string;
  error?: string;
};

export async function getWeather(city: string): Promise<Weather> {
  const r = await fetch(`${BASE}/api/weather?city=${encodeURIComponent(city)}`);
  return r.json();
}
export async function getImages(q: string): Promise<ImageHit[]> {
  const r = await fetch(`${BASE}/api/images?query=${encodeURIComponent(q)}`);
  return r.json();
}
export async function convert(from: string, to: string, amount: number): Promise<ConvertResp> {
  const r = await fetch(`${BASE}/api/convert?from=${from}&to=${to}&amount=${amount}`);
  return r.json();
}
export async function geocode(city: string): Promise<Geocode> {
  const r = await fetch(`${BASE}/api/geocode?city=${encodeURIComponent(city)}`);
  return r.json();
}