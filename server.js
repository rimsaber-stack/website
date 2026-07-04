const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3001;
const ORDERS_FILE = path.join(__dirname, 'orders.json');

const server = http.createServer((req, res) => {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') { res.writeHead(200); res.end(); return; }
  // Serve static files
  if (req.method === 'GET' && req.url !== '/api/orders') {
    let filePath = path.join(__dirname, req.url === '/' ? 'index.html' : req.url);
    const ext = path.extname(filePath);
    const types = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.png': 'image/png', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml' };
    fs.readFile(filePath, (err, data) => {
      if (err) { res.writeHead(404); res.end('Not found'); return; }
      res.writeHead(200, { 'Content-Type': types[ext] || 'text/plain' });
      res.end(data);
    });
    return;
  }

  // API: get orders
  if (req.method === 'GET' && req.url === '/api/orders') {
    const data = fs.existsSync(ORDERS_FILE) ? fs.readFileSync(ORDERS_FILE) : '[]';
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(data);
    return;
  }

  // API: submit order
  if (req.method === 'POST' && req.url === '/api/orders') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      const order = JSON.parse(body);
      order.date = new Date().toLocaleString();
      const orders = fs.existsSync(ORDERS_FILE) ? JSON.parse(fs.readFileSync(ORDERS_FILE)) : [];
      orders.push(order);
      fs.writeFileSync(ORDERS_FILE, JSON.stringify(orders, null, 2));
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true }));
    });
    return;
  }

  res.writeHead(404); res.end();
});

server.listen(PORT, () => {
  console.log(`Glitz server running at http://localhost:${PORT}`);
  console.log(`View orders: http://localhost:${PORT}/api/orders`);
});
