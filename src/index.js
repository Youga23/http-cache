var http = require('http');

var app = http.createServer(function (req, res) {
  switch (req.url) {
    case '/no-cache':
      console.log('in /no-cache');

      res.writeHead(200, {
        'Content-Type': 'text/plain',
        'Access-Control-Allow-Origin': '*',
      });
      res.write('no-cache ');
      res.end();
      break;

    case '/cache-expires':
      console.log('in /cache-expires');

      res.writeHead(200, {
        'Content-Type': 'text/plain',
        'Access-Control-Allow-Origin': '*',
        Expires: new Date(Date.now() + 1000 * 5).toUTCString(),
      });
      res.write('cache 5s');
      res.end();
      break;

    case '/cache-control':
      console.log('in /cache-control');

      res.writeHead(200, {
        'Content-Type': 'text/plain',
        'Access-Control-Allow-Origin': '*',
        Expires: new Date(Date.now() + 1000 * 5).toUTCString(),
        //使用 Cache-Control  Expires失效
        'Cache-Control': 'max-age=10',
      });
      res.write('cache max-age 10s');
      res.end();
      break;

    case '/if-modified-since':
      console.log('in /if-modified-since');

      if (
        new Date(req.headers['if-modified-since']).getTime() === new Date('2021-12-01').getTime()
      ) {
        res.writeHead(304);
        res.end();
      } else {
        res.writeHead(200, {
          'Content-Type': 'application/javascript;',
          'Access-Control-Allow-Origin': '*',
          'Cache-Control': 'no-cache',
          'Last-Modified': new Date('2021-12-01').toUTCString(),
        });
        res.write('cache if-modified-since');
        res.end();
      }

      break;

    case '/cache-etag':
      console.log('in /cache-etag');

      if (req.headers['if-none-match'] === '123') {
        res.writeHead(304);
        res.end();
      } else {
        res.writeHead(200, {
          'Content-Type': 'application/javascript;',
          'Access-Control-Allow-Origin': '*',
          Expires: new Date(Date.now() + 1000 * 5).toUTCString(),
          'Cache-Control': 'max-age=3',
          'Last-Modified': new Date('2021-12-01').toUTCString(),
          Etag: '123',
        });
        res.write('cache etag 123');
        res.end();
      }

      break;

    default:
      console.log('run other', req.url);
      res.writeHead(200, {
        'Content-Type': 'text/plain',
        'Access-Control-Allow-Origin': '*',
      });
      res.write('Hello World! other ');
      res.end();
  }
});

app.listen(8080, function () {
  console.log('run server in 8080');
});
