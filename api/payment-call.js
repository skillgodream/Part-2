import crypto from 'crypto';

export default async function handler(req, res) {
  // Only accept POST requests from PayU
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed.' });
  }

  try {
    const body = req.body || {};
    const { status, txnid, amount } = body;
    const isSuccess = status === 'success';

    // Get the base website URL dynamically from request headers
    const protocol = req.headers['x-forwarded-proto'] || 'https';
    const host = req.headers['host'] || 'localhost:3000';
    const origin = `${protocol}://${host}`;

    // Redirect the browser straight to your frontend homepage with parameters
    const redirectUrl = `${origin}/?payment=${isSuccess ? 'success' : 'failed'}&txnid=${encodeURIComponent(txnid || '')}&amount=${encodeURIComponent(amount || '')}`;
    
    return res.redirect(303, redirectUrl);
  } catch (error) {
    console.error('Callback error:', error);
    return res.redirect(303, '/?payment=failed');
  }
}
