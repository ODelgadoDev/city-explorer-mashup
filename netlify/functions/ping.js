exports.handler = async () => {
    return {
      statusCode: 200,
      body: JSON.stringify({
        ok: true,
        node: process.version,
        hasOWM: !!process.env.OWM_KEY,
        hasPIX: !!process.env.PIXABAY_KEY,
        hasXRATE: !!process.env.XRATE_KEY
      })
    };
  };