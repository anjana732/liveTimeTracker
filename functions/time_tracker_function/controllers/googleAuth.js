const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client('YOUR_CLIENT_ID');

async function verifyToken(token) {
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: 'YOUR_CLIENT_ID', 
  });
  const payload = ticket.getPayload();
  return payload;
}
