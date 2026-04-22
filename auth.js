const http = require('http');

const client_id = process.env.SPOTIFY_CLIENT_ID;
const client_secret = process.env.SPOTIFY_CLIENT_SECRET;

if (!client_id || !client_secret) {
  console.error("Error: SPOTIFY_CLIENT_ID or SPOTIFY_CLIENT_SECRET environment variables are not set.");
  process.exit(1);
}

let cachedToken = null;
let tokenExpiry = 0;

function getSpotifyToken(callback) {
  const now = Date.now();
  if (cachedToken && now < tokenExpiry) {
    return callback(null, cachedToken);
  }

  const authData = new URLSearchParams({
    grant_type: 'client_credentials'
  });

  fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Authorization': 'Basic ' + Buffer.from(client_id + ':' + client_secret).toString('base64'),
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: authData.toString()
  })
    .then(res => {
      if (res.ok) {
        return res.json();
      }
      return res.text().then(text => {
        throw new Error(`Failed to fetch token: ${res.status} ${text}`);
      });
    })
    .then(body => {
      cachedToken = body.access_token;
      tokenExpiry = Date.now() + (body.expires_in - 60) * 1000;
      console.log("Token refreshed successfully");
      callback(null, cachedToken);
    })
    .catch(e => {
      console.error("Error fetching token:", e);
      callback(e);
    });
}

const server = http.createServer((req, res) => {
  // Restrict to localhost for better security
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8000');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  if (req.url === '/api/token') {
    getSpotifyToken((err, token) => {
      if (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Failed to fetch token' }));
      } else {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ access_token: token }));
      }
    });
  } else {
    res.writeHead(404);
    res.end();
  }
});

const PORT = 3001;
server.listen(PORT, () => {
  console.log(`Token server running at http://localhost:${PORT}`);
});
