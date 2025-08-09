export async function handler(event) {
  const XRATE_KEY = process.env.XRATE_KEY;
  const params = new URLSearchParams(event.rawQuery);
  const from = params.get('from') || 'USD';
  const to   = params.get('to')   || 'MXN';
  const amount = Number(params.get('amount') || 100);

  const url = `https://v6.exchangerate-api.com/v6/${XRATE_KEY}/latest/${from}`;

  try {
    const r = await fetch(url);
    const d = await r.json();
    if (d.result !== 'success') {
      return { statusCode: 400, body: JSON.stringify({ error: 'rate error' }) };
    }
    const rate = d.conversion_rates?.[to];
    if (!rate) return { statusCode: 400, body: JSON.stringify({ error: 'unsupported currency' }) };
    return { statusCode: 200, body: JSON.stringify({ result: amount * rate, rate }) };
  } catch {
    return { statusCode: 500, body: JSON.stringify({ error: 'convert error' }) };
  }
}