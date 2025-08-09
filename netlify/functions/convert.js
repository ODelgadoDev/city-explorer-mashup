exports.handler = async (event) => {
  try {
    const XRATE_KEY = process.env.XRATE_KEY;
    const params = new URLSearchParams(event.rawQuery || '');
    const from = (params.get('from') || 'USD').toUpperCase();
    const to   = (params.get('to')   || 'MXN').toUpperCase();
    const amount = Number(params.get('amount') || 100);

    // 1) Intento con /pair (más directo)
    const urlPair = `https://v6.exchangerate-api.com/v6/${XRATE_KEY}/pair/${from}/${to}/${amount}`;
    let resp = await fetch(urlPair);
    let raw = await resp.text();
    if (!resp.ok) {
      console.error('XRATE /pair error:', resp.status, raw);
    } else {
      const d = JSON.parse(raw);
      if (d.result === 'success' && typeof d.conversion_result === 'number') {
        return {
          statusCode: 200,
          body: JSON.stringify({ result: d.conversion_result, rate: d.conversion_rate })
        };
      } else {
        console.error('XRATE /pair payload:', d);
      }
    }

    // 2) Fallback a /latest
    const urlLatest = `https://v6.exchangerate-api.com/v6/${XRATE_KEY}/latest/${from}`;
    resp = await fetch(urlLatest);
    raw = await resp.text();
    if (!resp.ok) {
      console.error('XRATE /latest error:', resp.status, raw);
      return { statusCode: resp.status, body: JSON.stringify({ error: `XRATE ${resp.status}: ${raw}` }) };
    }
    const d2 = JSON.parse(raw);
    if (d2.result !== 'success' || !d2.conversion_rates?.[to]) {
      console.error('XRATE /latest payload:', d2);
      return { statusCode: 400, body: JSON.stringify({ error: 'rate error' }) };
    }
    const rate = d2.conversion_rates[to];
    return { statusCode: 200, body: JSON.stringify({ result: amount * rate, rate }) };

  } catch (e) {
    console.error('convert crash:', e);
    return { statusCode: 500, body: JSON.stringify({ error: String(e) }) };
  }
};