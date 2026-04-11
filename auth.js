const http = require('http');
const https = require('https');
const querystring = require('querystring');

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

  const authData = querystring.stringify({
    grant_type: 'client_credentials'
  });

  const options = {
    hostname: 'accounts.spotify.com',
    port: 443,
    path: '/api/token',
    method: 'POST',
    headers: {
      'Authorization': 'Basic ' + Buffer.from(client_id + ':' + client_secret).toString('base64'),
      'Content-Type': 'application/x-www-form-urlencoded',
      'Content-Length': Buffer.byteLength(authData)
    }
  };

  const req = https.request(options, (res) => {
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    res.on('end', () => {
      if (res.statusCode === 200) {
        try {
          const body = JSON.parse(data);
          cachedToken = body.access_token;
          tokenExpiry = Date.now() + (body.expires_in - 60) * 1000;
          console.log("Token refreshed successfully");
          callback(null, cachedToken);
        } catch (e) {
          callback(e);
        }
      } else {
        callback(new Error(`Failed to fetch token: ${res.statusCode} ${data}`));
      }
    });
  });

  req.on('error', (e) => {
    console.error("Error fetching token:", e);
    callback(e);
  });

  req.write(authData);
  req.end();
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
