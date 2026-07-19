const http = require('http');

const data = JSON.stringify({
  prompt: 'What is Artificial Intelligence?',
  conversationId: '6a5cd0f99bb31c57f4dfaa80'
});

const req = http.request({
  hostname: 'localhost',
  port: 8000,
  path: '/api/agent/chat/stream',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'x-user-id': '123'
  }
}, (res) => {
  console.log(`STATUS: ${res.statusCode}`);
  res.on('data', (chunk) => {
    console.log(`BODY: ${chunk}`);
  });
  res.on('end', () => {
    console.log('No more data in response.');
  });
});

req.on('error', (e) => {
  console.error(`problem with request: ${e.message}`);
});

req.write(data);
req.end();
