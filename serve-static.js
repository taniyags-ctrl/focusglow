const http = require('http');
const fs = require('fs');
const path = require('path');

const server = http.createServer((req, res) => {
  let filePath = path.join(__dirname, req.url === '/' ? 'index.html' : req.url);
  
  // Add .html extension if not present
  if (!path.extname(filePath)) {
    filePath += '.html';
  }
  
  fs.readFile(filePath, (err, data) => {
    if (err) {
      // Try 404
      try {
        fs.readFile(path.join(__dirname, '404.html'), (err2, data404) => {
          res.writeHead(404, { 'Content-Type': 'text/html' });
          res.end(data404);
        });
      } catch(e) {
        res.writeHead(404);
        res.end('404 Not Found');
      }
      return;
    }
    
    // Set content type based on extension
    const contentType = req.url.endsWith('.html') ? 'text/html' : 
                       req.url.endsWith('.css') ? 'text/css' :
                       req.url.endsWith('.js') ? 'application/javascript' :
                       req.url.endsWith('.svg') ? 'image/svg+xml' :
                       'application/octet-stream';
    
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(data);
  });
});

server.listen(3000, () => {
  console.log('Static server running on http://localhost:3000');
  console.log('Press Ctrl+C to stop');
});