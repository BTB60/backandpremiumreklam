const http = require('http');
const url = require('url');

const PORT = 3002;

// Mock database
const users = [];

const server = http.createServer((req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  const parsedUrl = url.parse(req.url, true);
  const path = parsedUrl.pathname;

  // Parse request body
  let body = '';
  req.on('data', chunk => {
    body += chunk.toString();
  });

  req.on('end', () => {
    let data = {};
    try {
      if (body) data = JSON.parse(body);
    } catch (e) {}

    // Routes
    if (path === '/api/auth/register' && req.method === 'POST') {
      // Check if user exists
      const existingUser = users.find(u => u.phone === data.phone);
      if (existingUser) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Bu telefon nömrəsi artıq qeydiyyatdan keçib' }));
        return;
      }

      // Create new user
      const newUser = {
        id: Date.now().toString(),
        fullName: data.fullName,
        phone: data.phone,
        companyName: data.companyName,
        role: 'DECORATOR',
        createdAt: new Date().toISOString()
      };
      users.push(newUser);

      console.log('New user registered:', newUser);

      res.writeHead(201, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ 
        message: 'Qeydiyyat uğurlu oldu',
        user: newUser 
      }));
      return;
    }

    if (path === '/api/auth/login' && req.method === 'POST') {
      const user = users.find(u => u.phone === data.phone);
      
      if (!user) {
        res.writeHead(401, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Telefon nömrəsi və ya şifrə yanlışdır' }));
        return;
      }

      // Mock tokens
      const tokens = {
        accessToken: 'mock_access_token_' + Date.now(),
        refreshToken: 'mock_refresh_token_' + Date.now(),
        user: user
      };

      console.log('User logged in:', user);

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(tokens));
      return;
    }

    // Health check
    if (path === '/api/health') {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ status: 'OK' }));
      return;
    }

    // 404
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'Not found' }));
  });
});

server.listen(PORT, () => {
  console.log(`Mock API server running on http://localhost:${PORT}`);
  console.log('Available endpoints:');
  console.log('  POST /api/auth/register');
  console.log('  POST /api/auth/login');
  console.log('  GET  /api/health');
});
