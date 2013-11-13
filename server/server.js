var express = require('express'),
    config = require('./config'),
    app = express();

app.use(express.cookieParser())
  .use(express.cookieSession({ secret: config.server.cookieSecret }))
  .use(express.json())
  .use(express.urlencoded())
  .use(app.router)
  .use('/', express.static(config.client.dist));
